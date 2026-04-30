package com.verdantai.resume.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.verdantai.resume.dto.AuthResponse;
import com.verdantai.resume.dto.LoginRequest;
import com.verdantai.resume.dto.RegisterRequest;
import com.verdantai.resume.dto.UserResponse;
import com.verdantai.resume.exception.BadRequestException;
import com.verdantai.resume.exception.ResourceNotFoundException;
import com.verdantai.resume.model.Role;
import com.verdantai.resume.model.User;
import com.verdantai.resume.repository.UserRepository;
import com.verdantai.resume.security.CustomUserDetailsService;
import com.verdantai.resume.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered.");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return new AuthResponse(jwtService.generateToken(userDetails), toUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        User user = findByEmail(email);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return new AuthResponse(jwtService.generateToken(userDetails), toUserResponse(user));
    }

    public UserResponse me(String email) {
        return toUserResponse(findByEmail(email));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
