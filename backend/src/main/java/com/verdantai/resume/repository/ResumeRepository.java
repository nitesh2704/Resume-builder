package com.verdantai.resume.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.verdantai.resume.model.Resume;

public interface ResumeRepository extends MongoRepository<Resume, String> {
    List<Resume> findByUserIdOrderByUpdatedAtDesc(String userId);

    Optional<Resume> findByIdAndUserId(String id, String userId);

    List<Resume> findByUserIdAndTitleContainingIgnoreCaseOrderByUpdatedAtDesc(String userId, String title);
}
