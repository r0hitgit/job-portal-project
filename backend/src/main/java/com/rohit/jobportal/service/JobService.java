package com.rohit.jobportal.service;

import com.rohit.jobportal.entity.Job;
import com.rohit.jobportal.entity.Role;
import com.rohit.jobportal.entity.User;
import com.rohit.jobportal.repository.JobRepository;
import com.rohit.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    // ✅ Create Job (Recruiter only)

    public Job createJob(Job job) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("=== CREATE JOB - email from token: " + email);
        System.out.println("=== CREATE JOB - authorities: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("=== CREATE JOB - user role: " + recruiter.getRole());

        job.setRecruiter(recruiter);
        return jobRepository.save(job);
    }

    //  Get All Jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Get Jobs created by logged-in recruiter
    public List<Job> getMyJobs() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jobRepository.findByRecruiter(recruiter);
    }
}