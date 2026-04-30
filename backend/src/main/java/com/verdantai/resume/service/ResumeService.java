package com.verdantai.resume.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.verdantai.resume.dto.ResumeRequest;
import com.verdantai.resume.dto.ResumeResponse;
import com.verdantai.resume.dto.ResumeScoreResponse;
import com.verdantai.resume.dto.ScoreRequest;
import com.verdantai.resume.exception.ResourceNotFoundException;
import com.verdantai.resume.model.PersonalInfo;
import com.verdantai.resume.model.Resume;
import com.verdantai.resume.model.User;
import com.verdantai.resume.repository.ResumeRepository;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AuthService authService;
    private final ResumeScoringService scoringService;

    public ResumeService(ResumeRepository resumeRepository, AuthService authService, ResumeScoringService scoringService) {
        this.resumeRepository = resumeRepository;
        this.authService = authService;
        this.scoringService = scoringService;
    }

    public List<ResumeResponse> list(String email) {
        User user = authService.findByEmail(email);
        return resumeRepository.findByUserIdOrderByUpdatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ResumeResponse> search(String email, String keyword) {
        User user = authService.findByEmail(email);
        if (keyword == null || keyword.isBlank()) {
            return list(email);
        }
        return resumeRepository.findByUserIdAndTitleContainingIgnoreCaseOrderByUpdatedAtDesc(user.getId(), keyword.trim()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ResumeResponse get(String email, String id) {
        return toResponse(findOwnedResume(email, id));
    }

    public ResumeResponse create(String email, ResumeRequest request) {
        User user = authService.findByEmail(email);
        Resume resume = new Resume();
        resume.setUserId(user.getId());
        applyRequest(resume, request);
        updateScore(resume);
        return toResponse(resumeRepository.save(resume));
    }

    public ResumeResponse update(String email, String id, ResumeRequest request) {
        Resume resume = findOwnedResume(email, id);
        applyRequest(resume, request);
        updateScore(resume);
        return toResponse(resumeRepository.save(resume));
    }

    public ResumeScoreResponse score(ScoreRequest request) {
        return scoringService.score(request);
    }

    public void delete(String email, String id) {
        Resume resume = findOwnedResume(email, id);
        resumeRepository.delete(resume);
    }

    private Resume findOwnedResume(String email, String id) {
        User user = authService.findByEmail(email);
        return resumeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found."));
    }

    private void applyRequest(Resume resume, ResumeRequest request) {
        resume.setTitle(request.title());
        resume.setTargetRole(nullToEmpty(request.targetRole()));
        resume.setJobDescription(nullToEmpty(request.jobDescription()));
        resume.setTemplateId(nullToDefault(request.templateId(), "forest"));
        resume.setPersonalInfo(request.personalInfo() == null ? new PersonalInfo() : request.personalInfo());
        resume.setSummary(nullToEmpty(request.summary()));
        resume.setExperience(request.experience() == null ? List.of() : request.experience());
        resume.setEducation(request.education() == null ? List.of() : request.education());
        resume.setProjects(request.projects() == null ? List.of() : request.projects());
        resume.setSkills(request.skills() == null ? List.of() : request.skills());
        resume.setCertifications(request.certifications() == null ? List.of() : request.certifications());
        resume.setUpdatedAt(Instant.now());
    }

    private void updateScore(Resume resume) {
        List<String> bullets = resume.getExperience().stream()
                .flatMap(item -> (item.getAchievements() == null ? List.<String>of() : item.getAchievements()).stream())
                .toList();
        ResumeScoreResponse score = scoringService.score(new ScoreRequest(
                resume.getTargetRole(),
                resume.getJobDescription(),
                resume.getSummary(),
                resume.getSkills(),
                bullets
        ));
        resume.setAtsScore(score.score());
        resume.setMatchedKeywords(score.matchedKeywords());
    }

    private ResumeResponse toResponse(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getTargetRole(),
                resume.getJobDescription(),
                resume.getTemplateId(),
                resume.getPersonalInfo(),
                resume.getSummary(),
                resume.getExperience(),
                resume.getEducation(),
                resume.getProjects(),
                resume.getSkills(),
                resume.getCertifications(),
                resume.getMatchedKeywords(),
                resume.getAtsScore(),
                resume.getCreatedAt(),
                resume.getUpdatedAt()
        );
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private String nullToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
