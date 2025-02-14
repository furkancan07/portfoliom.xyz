package com.rf.portfolioM.repository;

import com.rf.portfolioM.model.Experience;
import com.rf.portfolioM.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience,String> {
    List<Experience> findByUserOrderByEndDateDesc(User user);
    void deleteAllByUser(User user);
}
