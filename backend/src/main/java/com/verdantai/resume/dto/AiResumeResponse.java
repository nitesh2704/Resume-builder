package com.verdantai.resume.dto;

import java.util.List;

public record AiResumeResponse(
        String name,
        String role,
        String summary,
        List<String> skills,
        List<AiResumeExperience> experience,
        List<AiResumeProject> projects,
        List<AiResumeEducation> education
) {
    public record AiResumeExperience(
            String role,
            String company,
            String startDate,
            String endDate,
            String location,
            List<String> achievements
    ) {
    }

    public record AiResumeProject(
            String name,
            String description,
            String link,
            List<String> technologies
    ) {
    }

    public record AiResumeEducation(
            String institution,
            String degree,
            String startYear,
            String endYear,
            String score
    ) {
    }
}
