package com.rf.portfolioM.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rf.portfolioM.dto.AuthResponse;
import com.rf.portfolioM.dto.UserInformation;
import com.rf.portfolioM.security.model.CustomOAuth2User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, IOException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(oAuth2User.getToken());
        authResponse.setUser(new UserInformation(
                oAuth2User.getUser().getId(),
                oAuth2User.getUser().getUsername(),
                oAuth2User.getUser().getName(),
                oAuth2User.getUser().getSurname(),
                oAuth2User.getUser().getProfilePhotoUrl(),
                oAuth2User.getUser().getRole()
        ));


        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(authResponse));
    }
}
