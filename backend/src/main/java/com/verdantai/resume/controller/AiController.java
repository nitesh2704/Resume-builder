package com.verdantai.resume.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.verdantai.resume.dto.AiSuggestionRequest;
import com.verdantai.resume.dto.AiSuggestionResponse;
import com.verdantai.resume.dto.GrammarRequest;
import com.verdantai.resume.dto.GrammarResponse;
import com.verdantai.resume.service.AiService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/suggestions")
    public AiSuggestionResponse suggestions(@Valid @RequestBody AiSuggestionRequest request) {
        return aiService.suggestions(request);
    }

    @PostMapping("/grammar")
    public GrammarResponse correctGrammar(@Valid @RequestBody GrammarRequest request) {
        return aiService.correctGrammar(request);
    }
}
