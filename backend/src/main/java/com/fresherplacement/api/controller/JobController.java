package com.fresherplacement.api.controller;

import com.fresherplacement.api.dto.JobDto;
import com.fresherplacement.api.entity.WorkType;
import com.fresherplacement.api.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs API", description = "Endpoints for viewing, creating, searching, and deduplicating job listings")
public class JobController {

    private final JobService jobService;

    @GetMapping
    @Operation(summary = "Get all jobs or filter by search query & work mode")
    public ResponseEntity<List<JobDto>> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) WorkType type) {
        if (search != null || type != null) {
            return ResponseEntity.ok(jobService.searchJobs(search, type));
        }
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job by ID")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create or update a job listing (with multi-parameter exact fingerprint deduplication)")
    public ResponseEntity<JobDto> saveJob(@Valid @RequestBody JobDto dto) {
        JobDto saved = jobService.saveJob(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a job listing by ID")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/clean-duplicates")
    @Operation(summary = "Scan database and purge all duplicate job entries matching company, role, location, salary & description")
    public ResponseEntity<Map<String, Object>> cleanDuplicates() {
        return ResponseEntity.ok(jobService.cleanDuplicates());
    }
}
