package com.verdantai.resume.dto;

import jakarta.validation.constraints.NotBlank;

public record GrammarRequest(
        @NotBlank String text
) {
}
