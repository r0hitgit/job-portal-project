package com.rohit.jobportal.controller;

import com.rohit.jobportal.entity.Job;
import com.rohit.jobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // ✅ Only RECRUITER or ADMIN can create job
    @PostMapping
    //@PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    // ✅ All roles can view jobs
    @GetMapping
    //@PreAuthorize("hasAnyRole('RECRUITER','ADMIN','CANDIDATE')")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // ✅ Recruiter can see only their jobs
    @GetMapping("/my-jobs")
    //@PreAuthorize("hasRole('RECRUITER')")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<List<Job>> getMyJobs() {
        return ResponseEntity.ok(jobService.getMyJobs());
    }
}