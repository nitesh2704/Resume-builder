package com.verdantai.resume.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public record AiSuggestionRequest(
        @NotBlank String targetRole,
        String jobDescription,
        String currentSummary,
        List<String> skills,
        List<String> achievements
) {
}
