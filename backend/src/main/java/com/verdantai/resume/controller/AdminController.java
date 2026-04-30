package com.verdantai.resume.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.verdantai.resume.dto.UserResponse;
import com.verdantai.resume.repository.UserRepository;
import com.verdantai.resume.service.AuthService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public AdminController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> users() {
        return userRepository.findAll().stream()
                .map(authService::toUserResponse)
                .toList();
    }
}
