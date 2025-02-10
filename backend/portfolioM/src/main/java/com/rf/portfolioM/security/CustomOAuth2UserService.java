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

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("USER EEE" + oAuth2User.getAttributes() + "  " + oAuth2User);
        String username = oAuth2User.getAttribute("login");
        String profilePhotoUrl = oAuth2User.getAttribute("avatar_url");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String aboutMe=oAuth2User.getAttribute("bio");
        String profileUrl = oAuth2User.getAttribute("html_url");
        Map<ContactAddresses,String> addres=new HashMap<>();
        addres.put(ContactAddresses.GITHUB,profileUrl);
        User user = userRepository.findByUsername(username).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setUsername(username);
            newUser.setAboutMe(aboutMe);
            newUser.setContactAddresses(addres);
            newUser.setSurname("");
            newUser.setProfilePhotoUrl(profilePhotoUrl);
            newUser.setRole(ROLE.ROLE_USER); // Varsayılan rol
            return userRepository.save(newUser);
        });


        String token = jwtService.createToken(user.getUsername());

        return new CustomOAuth2User(oAuth2User, token, user);

    }
}
