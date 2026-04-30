package com.verdantai.resume.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.verdantai.resume.model.Education;
import com.verdantai.resume.model.Experience;
import com.verdantai.resume.model.PersonalInfo;
import com.verdantai.resume.model.ProjectItem;
import com.verdantai.resume.model.Resume;
import com.verdantai.resume.model.ResumeTemplate;
import com.verdantai.resume.model.Role;
import com.verdantai.resume.model.User;
import com.verdantai.resume.repository.ResumeRepository;
import com.verdantai.resume.repository.ResumeTemplateRepository;
import com.verdantai.resume.repository.UserRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            ResumeTemplateRepository templateRepository,
            UserRepository userRepository,
            ResumeRepository resumeRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (templateRepository.count() == 0) {
                templateRepository.saveAll(List.of(
                        template("forest", "Forest Professional", "Balanced, ATS-friendly layout with green section accents.", "#1F7A4C", List.of("ATS", "Professional", "Balanced")),
                        template("canopy", "Canopy Modern", "Premium two-column layout for projects, skills, and experience.", "#4ADE80", List.of("Modern", "Projects", "SaaS")),
                        template("moss", "Moss Minimal", "Simple academic layout for freshers, internships, and final-year projects.", "#166534", List.of("Fresher", "Minimal", "Academic"))
                ));
            }

            if (!userRepository.existsByEmail("demo@verdantai.dev")) {
                User user = new User();
                user.setName("Demo Student");
                user.setEmail("demo@verdantai.dev");
                user.setPassword(passwordEncoder.encode("password123"));
                user.setRole(Role.USER);
                userRepository.save(user);

                Resume resume = new Resume();
                resume.setUserId(user.getId());
                resume.setTitle("Spring Boot Developer Resume");
                resume.setTargetRole("Backend Developer");
                resume.setTemplateId("forest");
                resume.setSummary("Final-year computer science student building secure Spring Boot APIs, MongoDB data models, and React dashboards with measurable project outcomes.");
                resume.setPersonalInfo(personalInfo());
                resume.setSkills(List.of("Java", "Spring Boot", "MongoDB", "JWT", "React", "REST API", "Tailwind CSS", "OpenAI API"));
                resume.setEducation(List.of(education()));
                resume.setExperience(List.of(experience()));
                resume.setProjects(List.of(project()));
                resume.setCertifications(List.of("MongoDB Basics", "Java Full Stack Development"));
                resumeRepository.save(resume);
            }
        };
    }

    private ResumeTemplate template(String id, String name, String description, String accentColor, List<String> tags) {
        ResumeTemplate template = new ResumeTemplate();
        template.setId(id);
        template.setName(name);
        template.setDescription(description);
        template.setAccentColor(accentColor);
        template.setTags(tags);
        return template;
    }

    private PersonalInfo personalInfo() {
        PersonalInfo info = new PersonalInfo();
        info.setFullName("Demo Student");
        info.setEmail("demo@verdantai.dev");
        info.setPhone("+91 98765 43210");
        info.setLocation("Bengaluru, India");
        info.setLinkedin("linkedin.com/in/demo-student");
        info.setPortfolio("demo.dev");
        return info;
    }

    private Education education() {
        Education education = new Education();
        education.setInstitution("VTU Affiliated Engineering College");
        education.setDegree("B.E. Computer Science and Engineering");
        education.setStartYear("2022");
        education.setEndYear("2026");
        education.setScore("8.7 CGPA");
        return education;
    }

    private Experience experience() {
        Experience experience = new Experience();
        experience.setCompany("Campus Innovation Lab");
        experience.setRole("Full Stack Developer Intern");
        experience.setStartDate("Jan 2026");
        experience.setEndDate("Apr 2026");
        experience.setLocation("Remote");
        experience.setAchievements(List.of(
                "Built 12 secure REST endpoints with JWT authentication and validation.",
                "Improved resume scoring workflow by matching 20+ job description keywords.",
                "Reduced repeated frontend form code by 35% using reusable React components."
        ));
        return experience;
    }

    private ProjectItem project() {
        ProjectItem project = new ProjectItem();
        project.setName("Verdant AI Resume Builder");
        project.setDescription("AI-powered full-stack resume builder with role-specific suggestions, ATS scoring, templates, and PDF export.");
        project.setTechnologies(List.of("React", "Tailwind CSS", "Spring Boot", "MongoDB", "OpenAI API"));
        project.setLink("github.com/demo/verdant-ai");
        return project;
    }
}
