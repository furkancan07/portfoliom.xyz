package com.rf.portfolioM.repository;

import com.rf.portfolioM.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project,String> {
}
