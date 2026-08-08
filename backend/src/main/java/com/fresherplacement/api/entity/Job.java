package com.fresherplacement.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs", indexes = {
    @Index(name = "idx_job_fingerprint", columnList = "fingerprint", unique = true),
    @Index(name = "idx_job_company", columnList = "company"),
    @Index(name = "idx_job_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    private String logo;

    @Column(name = "logo_color")
    private String logoColor;

    @Column(nullable = false)
    private String role;

    private String location;

    @Enumerated(EnumType.STRING)
    private WorkType type;

    private String experience;

    private String salary;

    private String posted;

    @Column(name = "apply_link", length = 1024)
    private String applyLink;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_requirements", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "requirement")
    @Builder.Default
    private List<String> requirements = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_tags", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Column(unique = true, nullable = false)
    private String fingerprint;

    @Column(name = "instagram_posted")
    private Boolean instagramPosted;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Explicit Getters and Setters for universal Java compiler compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public String getLogoColor() { return logoColor; }
    public void setLogoColor(String logoColor) { this.logoColor = logoColor; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public WorkType getType() { return type; }
    public void setType(WorkType type) { this.type = type; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getPosted() { return posted; }
    public void setPosted(String posted) { this.posted = posted; }

    public String getApplyLink() { return applyLink; }
    public void setApplyLink(String applyLink) { this.applyLink = applyLink; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getRequirements() { return requirements; }
    public void setRequirements(List<String> requirements) { this.requirements = requirements; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getFingerprint() { return fingerprint; }
    public void setFingerprint(String fingerprint) { this.fingerprint = fingerprint; }

    public Boolean getInstagramPosted() { return instagramPosted; }
    public void setInstagramPosted(Boolean instagramPosted) { this.instagramPosted = instagramPosted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
