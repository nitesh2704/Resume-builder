package com.verdantai.resume.dto;

import java.time.Instant;
import java.util.List;

import com.verdantai.resume.model.Education;
import com.verdantai.resume.model.Experience;
import com.verdantai.resume.model.PersonalInfo;
import com.verdantai.resume.model.ProjectItem;

public record ResumeResponse(
        String id,
        String title,
        String targetRole,
        String jobDescription,
        String templateId,
        PersonalInfo personalInfo,
        String summary,
        List<Experience> experience,
        List<Education> education,
        List<ProjectItem> projects,
        List<String> skills,
        List<String> certifications,
        List<String> matchedKeywords,
        int atsScore,
        Instant createdAt,
        Instant updatedAt
) {
}
