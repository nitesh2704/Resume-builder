package com.verdantai.resume.dto;

import jakarta.validation.constraints.NotBlank;

public record AiResumeRequest(
        @NotBlank String input
) {
}
