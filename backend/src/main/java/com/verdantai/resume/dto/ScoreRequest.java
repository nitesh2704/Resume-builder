package com.verdantai.resume.dto;

import java.util.List;

public record ScoreRequest(
        String targetRole,
        String jobDescription,
        String summary,
        List<String> skills,
        List<String> bullets
) {
}
