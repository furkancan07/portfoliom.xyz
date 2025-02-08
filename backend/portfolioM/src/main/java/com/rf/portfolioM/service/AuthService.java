package com.rf.portfolioM.service;

import com.rf.portfolioM.dto.AuthResponse;
import com.rf.portfolioM.dto.LoginRequest;
import com.rf.portfolioM.dto.converter.DtoConverter;
import com.rf.portfolioM.exception.LoginException;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.utils.ApiResponse;
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
    public ApiResponse<AuthResponse> login(LoginRequest request){
        User user=userService.findByUserName(request.getUsername());
        if(!encoder.matches(request.getPassword(),user.getPassword())){
            throw new LoginException();
        }
        String token= jwtService.createToken(request.getUsername());
        AuthResponse response=AuthResponse.builder().token(token).user(converter.convertUserInformation(user)).build();
        return ApiResponse.ok("Giriş Başarılı",response);
    }
}
