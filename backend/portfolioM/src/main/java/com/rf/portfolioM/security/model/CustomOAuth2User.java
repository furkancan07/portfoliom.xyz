package com.rf.portfolioM.security.model;

import com.rf.portfolioM.model.User;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;


public class CustomOAuth2User extends DefaultOAuth2User {
    private final String token;
    private final User user;
    private final String refreshToken;

    public CustomOAuth2User(OAuth2User oAuth2User, String token, User user,String refreshToken) {
        super(oAuth2User.getAuthorities(), oAuth2User.getAttributes(), "login");
        this.token = token;
        this.user = user;
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }
}
