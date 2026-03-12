package com.rohit.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Job applied for
    @ManyToOne
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties({"applications", "recruiter"})
    private Job job;

    // Candidate who applied
    @ManyToOne
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties({"password"})
    private User candidate;

    // Application status
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDate appliedDate;

    // Automatically set applied date
    @PrePersist
    protected void onApply() {
        this.appliedDate = LocalDate.now();
    }
}