package com.rohit.jobportal.repository;

import com.rohit.jobportal.entity.Application;
import com.rohit.jobportal.entity.Job;
import com.rohit.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByCandidate(User candidate);

    List<Application> findByJob(Job job);

    Optional<Application> findByJobAndCandidate(Job job, User candidate);
}