package com.rf.portfolioM.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rf.portfolioM.dto.AuthResponse;
import com.rf.portfolioM.dto.converter.DtoConverter;
import com.rf.portfolioM.security.model.CustomOAuth2User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DtoConverter converter;

    /*@Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, IOException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        AuthResponse authResponse = AuthResponse.builder().token(oAuth2User.getToken()).user(converter.convertUserInformation(oAuth2User.getUser())).build();

        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(authResponse));
    }*/

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String token = oAuth2User.getToken();
        String username = oAuth2User.getUser().getUsername();
        String userId=oAuth2User.getUser().getId();

        // Kullanıcıyı frontend'e yönlendir (Token'ı URL'ye ekleyerek)
        String redirectUrl = "https://www.portfoliom.xyz/callback?token=" + token + "&username=" + username+"&userId="+ userId;
        response.sendRedirect(redirectUrl);
    }
}
