package com.rf.portfolioM.repository;

import com.rf.portfolioM.model.Project;
import com.rf.portfolioM.model.enums.ProjectArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,String> {
    List<Project> findByUserId(String userId);
    List<Project> findByUserIdAndProjectArea(String userId, ProjectArea projectArea);
}
