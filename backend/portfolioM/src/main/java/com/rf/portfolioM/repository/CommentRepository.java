package com.rf.portfolioM.repository;

import com.rf.portfolioM.model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comments,String> {
}
