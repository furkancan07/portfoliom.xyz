package com.rf.portfolioM.repository;

import com.rf.portfolioM.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username LIKE %:username%")
    List<User> findUsersByUsername(@Param("username") String username);
}
