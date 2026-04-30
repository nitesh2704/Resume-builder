package com.verdantai.resume.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.verdantai.resume.model.ResumeTemplate;

public interface ResumeTemplateRepository extends MongoRepository<ResumeTemplate, String> {
}
