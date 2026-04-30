package com.verdantai.resume.dto;

import java.util.List;

public record AiSuggestionResponse(
        String role,
        List<String> summarySuggestions,
        List<String> achievementBullets,
        List<String> keywords,
        List<String> improvementTips
) {
}
