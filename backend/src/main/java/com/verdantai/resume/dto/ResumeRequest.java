package com.verdantai.resume.dto;

import java.util.List;

import com.verdantai.resume.model.Education;
import com.verdantai.resume.model.Experience;
import com.verdantai.resume.model.PersonalInfo;
import com.verdantai.resume.model.ProjectItem;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

public record ResumeRequest(
        @NotBlank String title,
        String targetRole,
        String jobDescription,
        String templateId,
        @Valid PersonalInfo personalInfo,
        String summary,
        List<Experience> experience,
        List<Education> education,
        List<ProjectItem> projects,
        List<String> skills,
        List<String> certifications
) {
}
