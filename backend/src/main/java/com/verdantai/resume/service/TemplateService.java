package com.verdantai.resume.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.verdantai.resume.model.ResumeTemplate;
import com.verdantai.resume.repository.ResumeTemplateRepository;

@Service
public class TemplateService {

    private final ResumeTemplateRepository templateRepository;

    public TemplateService(ResumeTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public List<ResumeTemplate> list() {
        return templateRepository.findAll();
    }
}
