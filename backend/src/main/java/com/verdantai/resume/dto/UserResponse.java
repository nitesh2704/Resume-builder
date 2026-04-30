package com.verdantai.resume.dto;

import com.verdantai.resume.model.Role;

public record UserResponse(
        String id,
        String name,
        String email,
        Role role
) {
}
