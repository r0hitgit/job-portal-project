package com.rohit.jobportal.controller;

import com.rohit.jobportal.entity.Application;
import com.rohit.jobportal.entity.ApplicationStatus;
import com.rohit.jobportal.service.ApplicationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Candidate → Apply for Job
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public Application applyForJob(@PathVariable Long jobId) {
        return applicationService.applyForJob(jobId);
    }

    // Candidate → View My Applications
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public List<Application> getMyApplications() {
        return applicationService.getMyApplications();
    }

    // Recruiter → View applicants for a job
    @GetMapping("/job/{jobId}")
    //@PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    @PreAuthorize("isAuthenticated()")
    public List<Application> getApplicationsForJob(@PathVariable Long jobId) {
        return applicationService.getApplicationsForJob(jobId);
    }

    // Recruiter → Accept / Reject candidate
    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public Application updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status


    ) {
        return applicationService.updateApplicationStatus(applicationId, status);
    }
}