package com.verdantai.resume.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.verdantai.resume.dto.AiSuggestionRequest;
import com.verdantai.resume.dto.AiSuggestionResponse;
import com.verdantai.resume.dto.GrammarRequest;
import com.verdantai.resume.dto.GrammarResponse;

@Service
public class AiService {

    private final String apiKey;
    private final String model;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final ResumeScoringService scoringService;

    public AiService(
            @Value("${app.openai.api-key}") String apiKey,
            @Value("${app.openai.model}") String model,
            @Value("${app.openai.base-url}") String baseUrl,
            ObjectMapper objectMapper,
            ResumeScoringService scoringService
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = objectMapper;
        this.scoringService = scoringService;
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public AiSuggestionResponse suggestions(AiSuggestionRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
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
            String text = callOpenAi(instructions, input);
            Map<String, List<String>> parsed = objectMapper.readValue(text, new TypeReference<Map<String, List<String>>>() {
            });
            return new AiSuggestionResponse(
                    request.targetRole(),
                    parsed.getOrDefault("summarySuggestions", List.of()),
                    parsed.getOrDefault("achievementBullets", List.of()),
                    parsed.getOrDefault("keywords", List.of()),
                    parsed.getOrDefault("improvementTips", List.of())
            );
        } catch (RuntimeException exception) {
            return fallbackSuggestions(request);
        } catch (Exception exception) {
            return fallbackSuggestions(request);
        }
    }

    public GrammarResponse correctGrammar(GrammarRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            return new GrammarResponse(localGrammarPolish(request.text()), "confident and professional");
        }

        try {
            String text = callOpenAi(
                    "Polish resume text for grammar, concision, and professional tone. Return only the corrected text.",
                    request.text()
            );
            return new GrammarResponse(text, "confident and professional");
        } catch (RuntimeException exception) {
            return new GrammarResponse(localGrammarPolish(request.text()), "confident and professional");
        }
    }

    private String callOpenAi(String instructions, String input) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", model);
        payload.put("instructions", instructions);
        payload.put("input", input);
        payload.put("temperature", 0.4);

        JsonNode response = restClient.post()
                .uri("/responses")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(payload)
                .retrieve()
                .body(JsonNode.class);

        return extractText(response);
    }

    private String extractText(JsonNode response) {
        if (response == null) {
            return "";
        }

        JsonNode output = response.path("output");
        if (output.isArray()) {
            for (JsonNode item : output) {
                JsonNode content = item.path("content");
                if (content.isArray()) {
                    for (JsonNode contentItem : content) {
                        if (contentItem.has("text")) {
                            return contentItem.path("text").asText();
                        }
                    }
                }
            }
        }

        JsonNode outputText = response.path("output_text");
        return outputText.isMissingNode() ? "" : outputText.asText();
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
}
