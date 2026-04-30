package com.verdantai.resume.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.verdantai.resume.dto.ResumeScoreResponse;
import com.verdantai.resume.dto.ScoreRequest;

@Service
public class ResumeScoringService {

    private static final Pattern SPLIT_PATTERN = Pattern.compile("[^a-zA-Z+#.]+");

    public ResumeScoreResponse score(ScoreRequest request) {
        Set<String> targetKeywords = new LinkedHashSet<>();
        targetKeywords.addAll(roleKeywords(request.targetRole()));
        targetKeywords.addAll(extractKeywords(request.jobDescription()));

        String candidateText = String.join(" ",
                safe(request.summary()),
                String.join(" ", nullSafe(request.skills())),
                String.join(" ", nullSafe(request.bullets()))
        ).toLowerCase(Locale.ROOT);

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        for (String keyword : targetKeywords) {
            if (keyword.length() < 3) {
                continue;
            }
            if (candidateText.contains(keyword.toLowerCase(Locale.ROOT))) {
                matched.add(keyword);
            } else {
                missing.add(keyword);
            }
        }

        int keywordScore = targetKeywords.isEmpty() ? 30 : (int) Math.round((matched.size() * 45.0) / targetKeywords.size());
        int summaryScore = safe(request.summary()).length() >= 120 ? 15 : safe(request.summary()).length() >= 60 ? 10 : 4;
        int skillsScore = nullSafe(request.skills()).size() >= 8 ? 20 : Math.min(20, nullSafe(request.skills()).size() * 2);
        int impactScore = impactBulletCount(request.bullets()) * 5;
        int total = Math.min(100, keywordScore + summaryScore + skillsScore + Math.min(20, impactScore));

        List<String> recommendations = new ArrayList<>();
        if (summaryScore < 15) {
            recommendations.add("Expand the summary with role, domain, measurable strengths, and key tools.");
        }
        if (!missing.isEmpty()) {
            recommendations.add("Add priority keywords naturally: " + String.join(", ", missing.stream().limit(6).toList()) + ".");
        }
        if (impactScore < 15) {
            recommendations.add("Rewrite bullets with action verbs, metrics, and business impact.");
        }
        if (recommendations.isEmpty()) {
            recommendations.add("Strong match. Keep bullets concise and tailor the top section for each job description.");
        }

        return new ResumeScoreResponse(total, matched, missing.stream().limit(12).toList(), recommendations);
    }

    public List<String> roleKeywords(String role) {
        String normalized = safe(role).toLowerCase(Locale.ROOT);
        if (normalized.contains("data")) {
            return List.of("python", "sql", "analytics", "dashboard", "machine learning", "data pipeline", "visualization");
        }
        if (normalized.contains("backend") || normalized.contains("spring")) {
            return List.of("spring boot", "rest api", "mongodb", "jwt", "microservices", "testing", "security");
        }
        if (normalized.contains("frontend") || normalized.contains("react")) {
            return List.of("react", "javascript", "tailwind", "accessibility", "api integration", "state management");
        }
        if (normalized.contains("product")) {
            return List.of("roadmap", "user research", "metrics", "stakeholder", "experimentation", "go-to-market");
        }
        return List.of("ownership", "collaboration", "problem solving", "delivery", "metrics", "communication");
    }

    private List<String> extractKeywords(String text) {
        String clean = safe(text).toLowerCase(Locale.ROOT);
        if (clean.isBlank()) {
            return List.of();
        }
        Set<String> keywords = new LinkedHashSet<>();
        List<String> words = Arrays.stream(SPLIT_PATTERN.split(clean))
                .filter(word -> word.length() > 3)
                .filter(word -> !stopWords().contains(word))
                .toList();
        for (String word : words) {
            if (keywords.size() >= 16) {
                break;
            }
            keywords.add(word);
        }
        return new ArrayList<>(keywords);
    }

    private int impactBulletCount(List<String> bullets) {
        return (int) nullSafe(bullets).stream()
                .filter(bullet -> bullet.matches(".*\\d+.*") || bullet.toLowerCase(Locale.ROOT).contains("improved")
                        || bullet.toLowerCase(Locale.ROOT).contains("reduced")
                        || bullet.toLowerCase(Locale.ROOT).contains("increased"))
                .count();
    }

    private Set<String> stopWords() {
        return Set.of("with", "that", "this", "from", "will", "your", "have", "and", "for", "using", "into", "over");
    }

    private List<String> nullSafe(List<String> values) {
        return values == null ? List.of() : values;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
