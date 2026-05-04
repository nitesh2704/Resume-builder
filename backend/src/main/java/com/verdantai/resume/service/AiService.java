package com.verdantai.resume.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.verdantai.resume.dto.AiSuggestionRequest;
import com.verdantai.resume.dto.AiSuggestionResponse;
import com.verdantai.resume.dto.AiResumeRequest;
import com.verdantai.resume.dto.AiResumeResponse;
import com.verdantai.resume.dto.GrammarRequest;
import com.verdantai.resume.dto.GrammarResponse;

@Service
public class AiService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AiService.class);

    private final String geminiApiKey;
    private final String geminiModel;
    private final String geminiKeySource;
    private final RestClient geminiClient;
    private final ObjectMapper objectMapper;
    private final ResumeScoringService scoringService;

    public AiService(
            @Value("${app.gemini.api-key}") String geminiApiKey,
            @Value("${app.gemini.model}") String geminiModel,
            @Value("${app.gemini.base-url}") String geminiBaseUrl,
            ObjectMapper objectMapper,
            ResumeScoringService scoringService
    ) {
        ResolvedKey resolvedKey = resolveGeminiApiKey(geminiApiKey);
        this.geminiApiKey = resolvedKey.key();
        this.geminiKeySource = resolvedKey.source();
        this.geminiModel = geminiModel;
        this.objectMapper = objectMapper;
        this.scoringService = scoringService;
        this.geminiClient = RestClient.builder().baseUrl(geminiBaseUrl).build();

        if (this.geminiApiKey == null || this.geminiApiKey.isBlank()) {
            LOGGER.warn("Gemini API key is not configured. AI features will fall back.");
        } else {
            LOGGER.info("Gemini API key loaded successfully from {}. Primary model: {}.", geminiKeySource, geminiModel);
        }
    }

    public AiSuggestionResponse suggestions(AiSuggestionRequest request) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return fallbackSuggestions(request);
        }

        String instructions = """
                You are an expert resume strategist. Return strict JSON only with keys:
                summarySuggestions, achievementBullets, keywords, improvementTips.
                Each key must contain an array of concise strings.
                """;
        String input = """
                Target role: %s
                Job description: %s
                Current summary: %s
                Skills: %s
                Achievements: %s
                Generate role-specific resume improvements with measurable, ATS-friendly language.
                """.formatted(
                request.targetRole(),
                nullToEmpty(request.jobDescription()),
                nullToEmpty(request.currentSummary()),
                String.join(", ", nullSafe(request.skills())),
                String.join(" | ", nullSafe(request.achievements()))
        );

        try {
            String text = callGemini(instructions, input, "application/json");
            String json = extractJson(text);
            Map<String, List<String>> parsed = objectMapper.readValue(json, new TypeReference<Map<String, List<String>>>() {
            });

            List<String> summary = parsed.getOrDefault("summarySuggestions", List.of());
            List<String> achievements = parsed.getOrDefault("achievementBullets", List.of());
            List<String> keywords = parsed.getOrDefault("keywords", List.of());
            List<String> tips = parsed.getOrDefault("improvementTips", List.of());

            // If Gemini returned empty arrays (or an empty object), fall back to local suggestions
            if ((summary == null || summary.isEmpty()) && (achievements == null || achievements.isEmpty())
                    && (keywords == null || keywords.isEmpty()) && (tips == null || tips.isEmpty())) {
                LOGGER.warn("Gemini returned empty suggestions for role {}. Falling back to local suggestions.", request.targetRole());
                return fallbackSuggestions(request);
            }

            return new AiSuggestionResponse(
                    request.targetRole(),
                    summary,
                    achievements,
                    keywords,
                    tips
            );
        } catch (RuntimeException exception) {
            LOGGER.warn("AI suggestions call failed: {}", exception.getMessage());
            return fallbackSuggestions(request);
        } catch (Exception exception) {
            LOGGER.warn("AI suggestions parsing failed: {}", exception.getMessage());
            return fallbackSuggestions(request);
        }
    }

    public GrammarResponse correctGrammar(GrammarRequest request) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return new GrammarResponse(localGrammarPolish(request.text()), "confident and professional");
        }

        try {
            String text = callGemini(
                    "Polish resume text for grammar, concision, and professional tone. Return only the corrected text.",
                    request.text(),
                    "text/plain"
            ).trim();
            return new GrammarResponse(text, "confident and professional");
        } catch (RuntimeException exception) {
            return new GrammarResponse(localGrammarPolish(request.text()), "confident and professional");
        }
    }

    public AiResumeResponse generateResume(AiResumeRequest request) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return emptyResumeResponse();
        }

        String instructions = """
                Extract resume details from the user input and return ONLY valid JSON with this exact shape.
                Rules:
                - Extract name, role, and professional summary from the input
                - For skills: parse comma-separated or space-separated technical skills
                - For experience: extract company, role, dates (startDate/endDate as "MMM YYYY" or "2024"), location, and achievements as an array of bullet points
                - For projects: extract project name, description, link (GitHub URL or portfolio link), and technologies as an array
                - For education: extract institution, degree, years (startYear/endYear as "2020"), and CGPA/score if mentioned
                
                JSON shape:
                {
                    "name": "string or empty",
                    "role": "target role or job title",
                    "summary": "professional summary 1-2 sentences",
                    "skills": ["skill1", "skill2"],
                    "experience": [
                        {
                            "role": "job title",
                            "company": "company name",
                            "startDate": "MMM YYYY or YYYY",
                            "endDate": "MMM YYYY or YYYY or 'Present'",
                            "location": "location or empty",
                            "achievements": ["achievement1", "achievement2"]
                        }
                    ],
                    "projects": [
                        {
                            "name": "project name",
                            "description": "project description",
                            "link": "URL or empty",
                            "technologies": ["tech1", "tech2"]
                        }
                    ],
                    "education": [
                        {
                            "institution": "school/college name",
                            "degree": "degree type",
                            "startYear": "YYYY",
                            "endYear": "YYYY",
                            "score": "CGPA or percentage or empty"
                        }
                    ]
                }
                
                Do not wrap the JSON in markdown code blocks. Return only the raw JSON object.
                """;

        String prompt = """
                Extract and structure the following into a resume:
                %s
                """.formatted(nullToEmpty(request.input()));

        try {
            String text = callGemini(instructions, prompt, "application/json");
            String json = extractJson(text);
            AiResumeResponse parsed = objectMapper.readValue(json, AiResumeResponse.class);
            if (isEmptyResume(parsed)) {
                return emptyResumeResponse();
            }
            return parsed;
        } catch (Exception exception) {
            LOGGER.error("Failed to generate resume from input: {}", exception.getMessage(), exception);
            return emptyResumeResponse();
        }
    }

    private String callGemini(String instructions, String prompt, String responseMimeType) {
        LinkedHashSet<String> models = new LinkedHashSet<>();
        if (geminiModel != null && !geminiModel.isBlank()) {
            models.add(geminiModel.trim());
        }
        models.add("gemini-2.5-flash");
        models.add("gemini-2.0-flash");

        RuntimeException lastFailure = null;
        for (String model : models) {
            try {
                LOGGER.info("Calling Gemini model {}.", model);
                Map<String, Object> payload = new LinkedHashMap<>();
                Map<String, Object> part = Map.of("text", prompt);
                Map<String, Object> content = Map.of("role", "user", "parts", List.of(part));
                payload.put("contents", List.of(content));
                payload.put("systemInstruction", Map.of("parts", List.of(Map.of("text", instructions))));
                payload.put("generationConfig", Map.of(
                        "temperature", 0.2,
                        "responseMimeType", responseMimeType,
                        "maxOutputTokens", 1024
                ));

                JsonNode response = geminiClient.post()
                        .uri("/models/{model}:generateContent?key={key}", model, geminiApiKey)
                        .header("Content-Type", "application/json")
                        .body(payload)
                        .retrieve()
                        .body(JsonNode.class);

                String text = extractGeminiText(response);
                if (text != null && !text.isBlank()) {
                    return text;
                }
                LOGGER.warn("Gemini model {} returned an empty response.", model);
            } catch (Exception exception) {
                lastFailure = new RuntimeException("Gemini model " + model + " failed: " + exception.getMessage(), exception);
                LOGGER.warn("Gemini model {} failed: {}", model, exception.getMessage());
            }
        }

        if (lastFailure != null) {
            throw lastFailure;
        }

        throw new RuntimeException("Gemini request failed for all configured models.");
    }

    private String extractGeminiText(JsonNode response) {
        if (response == null) {
            return "";
        }

        JsonNode candidates = response.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                return parts.get(0).path("text").asText("");
            }
        }

        return "";
    }

    private String extractJson(String text) {
        if (text == null) {
            return "{}";
        }

        String cleaned = text.trim();
        if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
            return cleaned;
        }
        if (cleaned.startsWith("```")) {
            int fenceEnd = cleaned.indexOf("\n");
            cleaned = fenceEnd > -1 ? cleaned.substring(fenceEnd + 1) : cleaned;
            int lastFence = cleaned.lastIndexOf("```");
            if (lastFence > -1) {
                cleaned = cleaned.substring(0, lastFence).trim();
            }
        }

        int start = cleaned.indexOf('{');
        int end = cleaned.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return cleaned.substring(start, end + 1);
        }

        return "{}";
    }

    private boolean isEmptyResume(AiResumeResponse response) {
        if (response == null) {
            return true;
        }
        boolean hasText = !nullToEmpty(response.summary()).isBlank()
                || !nullToEmpty(response.name()).isBlank()
                || !nullToEmpty(response.role()).isBlank();
        boolean hasLists = (response.skills() != null && !response.skills().isEmpty())
                || (response.experience() != null && !response.experience().isEmpty())
                || (response.projects() != null && !response.projects().isEmpty());
        return !(hasText || hasLists);
    }

    private AiResumeResponse emptyResumeResponse() {
        return new AiResumeResponse("", "", "", List.of(), List.of(), List.of(), List.of());
    }

    private AiSuggestionResponse fallbackSuggestions(AiSuggestionRequest request) {
        List<String> keywords = new ArrayList<>(scoringService.roleKeywords(request.targetRole()));
        return new AiSuggestionResponse(
                request.targetRole(),
                List.of(
                        "Results-driven " + request.targetRole() + " candidate with hands-on project delivery, clean documentation, and measurable ownership.",
                        "Built production-style applications using modern APIs, secure authentication, and responsive user experiences."
                ),
                List.of(
                        "Developed a role-specific resume workflow that improved ATS readiness through keyword matching and structured content.",
                        "Implemented secure REST APIs with validation, JWT authentication, and reusable service-layer logic.",
                        "Designed a responsive SaaS dashboard with live preview, search, filtering, and template-based resume creation."
                ),
                keywords,
                List.of(
                        "Add 2-3 quantified achievements under each project or internship.",
                        "Mirror high-priority job description keywords in the summary and skills sections.",
                        "Keep bullets under two lines and start each one with an action verb."
                )
        );
    }

    private String localGrammarPolish(String text) {
        String cleaned = nullToEmpty(text).trim().replaceAll("\\s+", " ");
        if (cleaned.isBlank()) {
            return "";
        }
        return Character.toUpperCase(cleaned.charAt(0)) + cleaned.substring(1);
    }

    private List<String> nullSafe(List<String> values) {
        return values == null ? List.of() : values;
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private ResolvedKey resolveGeminiApiKey(String configured) {
        String normalizedConfigured = normalizeEnvValue(configured);
        if (normalizedConfigured != null && !normalizedConfigured.isBlank()) {
            return new ResolvedKey(normalizedConfigured, "spring.config");
        }

        String envValue = normalizeEnvValue(System.getenv("GEMINI_API_KEY"));
        if (envValue != null && !envValue.isBlank()) {
            return new ResolvedKey(envValue, "process.env");
        }

        String fileValue = normalizeEnvValue(readEnvFileValue(".env", "GEMINI_API_KEY"));
        if (fileValue != null && !fileValue.isBlank()) {
            return new ResolvedKey(fileValue, "./.env");
        }

        String parentValue = normalizeEnvValue(readEnvFileValue("../.env", "GEMINI_API_KEY"));
        if (parentValue != null && !parentValue.isBlank()) {
            return new ResolvedKey(parentValue, "../.env");
        }

        return new ResolvedKey("", "missing");
    }

    private String normalizeEnvValue(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        if (trimmed.startsWith("export ")) {
            trimmed = trimmed.substring(7).trim();
        }
        if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            trimmed = trimmed.substring(1, trimmed.length() - 1).trim();
        }
        return trimmed;
    }

    private String readEnvFileValue(String path, String key) {
        java.nio.file.Path file = java.nio.file.Path.of(path);
        if (!java.nio.file.Files.exists(file)) {
            return null;
        }

        try {
            for (String line : java.nio.file.Files.readAllLines(file)) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
                    continue;
                }
                String[] parts = trimmed.split("=", 2);
                String name = parts[0].trim();
                if (name.startsWith("export ")) {
                    name = name.substring(7).trim();
                }
                if (parts.length == 2 && name.equals(key)) {
                    return parts[1].trim();
                }
            }
        } catch (Exception exception) {
            LOGGER.warn("Failed to read {} for Gemini key: {}", path, exception.getMessage());
        }

        return null;
    }

    private record ResolvedKey(String key, String source) {
    }
}
