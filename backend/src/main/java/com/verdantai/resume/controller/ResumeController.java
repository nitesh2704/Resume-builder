package com.verdantai.resume.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.verdantai.resume.dto.ResumeRequest;
import com.verdantai.resume.dto.ResumeResponse;
import com.verdantai.resume.dto.ResumeScoreResponse;
import com.verdantai.resume.dto.ScoreRequest;
import com.verdantai.resume.service.ResumeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping
    public List<ResumeResponse> list(Principal principal) {
        return resumeService.list(principal.getName());
    }

    @GetMapping("/search")
    public List<ResumeResponse> search(Principal principal, @RequestParam(required = false) String keyword) {
        return resumeService.search(principal.getName(), keyword);
    }

    @GetMapping("/{id}")
    public ResumeResponse get(Principal principal, @PathVariable String id) {
        return resumeService.get(principal.getName(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResumeResponse create(Principal principal, @Valid @RequestBody ResumeRequest request) {
        return resumeService.create(principal.getName(), request);
    }

    @PutMapping("/{id}")
    public ResumeResponse update(Principal principal, @PathVariable String id, @Valid @RequestBody ResumeRequest request) {
        return resumeService.update(principal.getName(), id, request);
    }

    @PostMapping("/score")
    public ResumeScoreResponse score(@RequestBody ScoreRequest request) {
        return resumeService.score(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Principal principal, @PathVariable String id) {
        resumeService.delete(principal.getName(), id);
    }
}
