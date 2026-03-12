package com.rohit.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String location;

    private Double salary;

    private String jobType;

    private LocalDate postedDate;

    // Recruiter who posted the job
    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    @JsonIgnoreProperties({"applications", "password"})
    private User recruiter;

    // Candidates who applied
    @OneToMany(mappedBy = "job")
    @JsonIgnore
    private List<Application> applications;

    // Automatically set postedDate when job is created
    @PrePersist
    protected void onCreate() {
        this.postedDate = LocalDate.now();
    }
}