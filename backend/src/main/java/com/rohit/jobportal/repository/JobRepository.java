package com.rohit.jobportal.repository;

import com.rohit.jobportal.entity.Job;
import com.rohit.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiter(User recruiter);

}