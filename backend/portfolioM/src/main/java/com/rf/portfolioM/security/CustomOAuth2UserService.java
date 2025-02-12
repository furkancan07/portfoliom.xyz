package com.rf.portfolioM.security;

import com.rf.portfolioM.model.User;
import com.rf.portfolioM.model.enums.ContactAddresses;
import com.rf.portfolioM.model.enums.ROLE;
import com.rf.portfolioM.repository.UserRepository;
import com.rf.portfolioM.security.model.CustomOAuth2User;
import com.rf.portfolioM.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);


        String username = oAuth2User.getAttribute("login");
        String profilePhotoUrl = oAuth2User.getAttribute("avatar_url");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String aboutMe = oAuth2User.getAttribute("bio");
        String profileUrl = oAuth2User.getAttribute("html_url");
        
        Map<ContactAddresses, String> contactAddresses = Map.of(ContactAddresses.GITHUB, profileUrl);


        User user = userRepository.findByUsername(username)
                .orElseGet(() -> createNewUser(username, email, name, profilePhotoUrl, aboutMe, contactAddresses));


        String token = jwtService.createToken(user.getUsername());


        return new CustomOAuth2User(oAuth2User, token, user);
    }


    private User createNewUser(String username, String email, String name, String profilePhotoUrl,
                               String aboutMe, Map<ContactAddresses, String> contactAddresses) {
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setProfilePhotoUrl(profilePhotoUrl);
        newUser.setAboutMe(aboutMe);
        newUser.setContactAddresses(contactAddresses);
        newUser.setRole(ROLE.ROLE_USER);
        return userRepository.save(newUser);
    }
}