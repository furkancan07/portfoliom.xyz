package com.rf.portfolioM.repository;

import com.rf.portfolioM.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,String> {
}
