package com.fresherplacement.api.service;

import com.fresherplacement.api.dto.JobDto;
import com.fresherplacement.api.entity.Job;
import com.fresherplacement.api.entity.WorkType;
import com.fresherplacement.api.repository.JobRepository;
import com.fresherplacement.api.util.JobFingerprintUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public List<JobDto> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<JobDto> searchJobs(String query, WorkType type) {
        return jobRepository.searchJobs(query, type)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Optional<JobDto> getJobById(Long id) {
        return jobRepository.findById(id).map(this::mapToDto);
    }

    @Transactional
    public JobDto saveJob(JobDto dto) {
        String formattedLink = dto.getApplyLink() != null ? dto.getApplyLink().trim() : "";
        if (!formattedLink.isEmpty() && !formattedLink.matches("(?i)^https?://.*")) {
            formattedLink = "https://" + formattedLink;
        }

        String fingerprint = JobFingerprintUtil.generateFingerprint(
                dto.getCompany(),
                dto.getRole(),
                dto.getLocation(),
                dto.getSalary(),
                dto.getExperience(),
                dto.getDescription()
        );

        Optional<Job> existingJobOpt = jobRepository.findByFingerprint(fingerprint);

        Job job;
        if (existingJobOpt.isPresent() && (dto.getId() == null || !dto.getId().equals(existingJobOpt.get().getId()))) {
            // Update existing matching duplicate instead of inserting a new record
            job = existingJobOpt.get();
        } else if (dto.getId() != null) {
            job = jobRepository.findById(dto.getId()).orElse(new Job());
        } else {
            job = new Job();
        }

        job.setCompany(dto.getCompany());
        job.setLogo(dto.getLogo());
        job.setLogoColor(dto.getLogoColor());
        job.setRole(dto.getRole());
        job.setLocation(dto.getLocation());
        job.setType(dto.getType() != null ? dto.getType() : WorkType.ONSITE);
        job.setExperience(dto.getExperience());
        job.setSalary(dto.getSalary());
        job.setPosted(dto.getPosted() != null ? dto.getPosted() : "Just now");
        job.setApplyLink(formattedLink);
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements() != null ? dto.getRequirements() : new ArrayList<>());
        job.setTags(dto.getTags() != null ? dto.getTags() : new ArrayList<>());
        job.setFingerprint(fingerprint);
        job.setInstagramPosted(dto.getInstagramPosted() != null ? dto.getInstagramPosted() : false);

        Job saved = jobRepository.save(job);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    @Transactional
    public Map<String, Object> cleanDuplicates() {
        List<Job> allJobs = jobRepository.findAllByOrderByCreatedAtDesc();
        Set<String> seenFingerprints = new HashSet<>();
        List<Long> duplicateIds = new ArrayList<>();

        for (Job job : allJobs) {
            String fp = JobFingerprintUtil.generateFingerprint(
                    job.getCompany(),
                    job.getRole(),
                    job.getLocation(),
                    job.getSalary(),
                    job.getExperience(),
                    job.getDescription()
            );
            if (seenFingerprints.contains(fp)) {
                duplicateIds.add(job.getId());
            } else {
                seenFingerprints.add(fp);
            }
        }

        if (!duplicateIds.isEmpty()) {
            jobRepository.deleteAllById(duplicateIds);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("removedCount", duplicateIds.size());
        response.put("uniqueCount", seenFingerprints.size());
        return response;
    }

    private JobDto mapToDto(Job job) {
        return JobDto.builder()
                .id(job.getId())
                .company(job.getCompany())
                .logo(job.getLogo())
                .logoColor(job.getLogoColor())
                .role(job.getRole())
                .location(job.getLocation())
                .type(job.getType())
                .experience(job.getExperience())
                .salary(job.getSalary())
                .posted(job.getPosted())
                .applyLink(job.getApplyLink())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .tags(job.getTags())
                .instagramPosted(job.getInstagramPosted())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
