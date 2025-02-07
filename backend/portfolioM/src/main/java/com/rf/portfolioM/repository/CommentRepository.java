package com.rf.portfolioM.repository;

import com.rf.portfolioM.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,String> {
    List<Comment> findByProjectId(String projectId);
    List<Comment> findByUserId(String userId);
}
