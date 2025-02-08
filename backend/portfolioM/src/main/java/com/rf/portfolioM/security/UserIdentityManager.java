package com.rf.portfolioM.security;

import com.rf.portfolioM.exception.UserNotAuthenticatedException;
import com.rf.portfolioM.model.User;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class UserIdentityManager {
    public User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof User user) {
            return user;
        } else {
            throw new UserNotAuthenticatedException();
        }


    }
}
