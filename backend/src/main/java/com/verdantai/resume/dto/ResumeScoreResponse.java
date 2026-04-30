package com.verdantai.resume.dto;

import java.util.List;

public record ResumeScoreResponse(
        int score,
        List<String> matchedKeywords,
        List<String> missingKeywords,
        List<String> recommendations
) {
}
