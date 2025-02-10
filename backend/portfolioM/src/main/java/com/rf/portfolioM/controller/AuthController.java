package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.AuthResponse;
import com.rf.portfolioM.dto.LoginRequest;
import com.rf.portfolioM.service.AuthService;
import com.rf.portfolioM.service.JwtService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.AUTH)
public class AuthController {
    private final AuthService service;
    private final JwtService jwtService;

    public AuthController(AuthService service, JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }

    // login
    @PostMapping(ApiPaths.LOGIN)
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(service.login(request));
    }


}
