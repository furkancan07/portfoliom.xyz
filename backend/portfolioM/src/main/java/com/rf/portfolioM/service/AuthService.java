package com.rf.portfolioM.service;

import com.rf.portfolioM.dto.AuthResponse;
import com.rf.portfolioM.dto.LoginRequest;
import com.rf.portfolioM.dto.RefreshTokenResponse;
import com.rf.portfolioM.dto.converter.DtoConverter;
import com.rf.portfolioM.exception.LoginException;
import com.rf.portfolioM.exception.UserNotAuthenticatedException;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.repository.UserRepository;
import com.rf.portfolioM.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final JwtService jwtService;
    private final DtoConverter converter;
    private final PasswordEncoder encoder;
    private final UserRepository repository;
    private final RefreshTokenService refreshTokenService;
    public AuthResponse login(LoginRequest request){
        User user=userService.findByUserName(request.getUsername());
        if(!encoder.matches(request.getPassword(),user.getPassword())){
            throw new LoginException();
        }
        String token= jwtService.createToken(request.getUsername());
        String refreshToken=refreshTokenService.createRefreshToken(request.getUsername());
        AuthResponse response=AuthResponse.builder().token(token).refreshToken(refreshToken).user(converter.convertUserInformation(user)).build();
        return response;
    }

    public RefreshTokenResponse refreshToken(String token){
        String username=refreshTokenService.validateRefreshToken(token);
        if(username==null){
            throw new UserNotAuthenticatedException();
        }
        String accessToken=jwtService.createToken(username);
        String refreshToken=refreshTokenService.rotateRefreshToken(token,username);
        return RefreshTokenResponse.builder().accessToken(accessToken).refreshToken(refreshToken).message("token yenilendi").build();
    }
    public String logout(String token){
        refreshTokenService.deleteRefreshToken(token);
        return "Çıkış Yapıldı";
    }

}
