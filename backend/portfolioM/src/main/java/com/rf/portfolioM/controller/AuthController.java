package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.AuthResponse;
import com.rf.portfolioM.dto.LoginRequest;
import com.rf.portfolioM.service.AuthService;
import com.rf.portfolioM.service.JwtService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPaths.AUTH)
public class AuthController {
    private final AuthService service;
    private final JwtService jwtService;

    public AuthController(AuthService service,JwtService jwtService) {
        this.service = service;
        this.jwtService=jwtService;
    }

    // login
    @PostMapping(ApiPaths.LOGIN)
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.ok(service.login(request));
    }
    // logout

    // kontrol
    @GetMapping("/protected-endpoint")
    public ResponseEntity<?> protectedEndpoint(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // "Bearer " kısmını çıkar

            if (jwtService.validateToken(token)) {
                // Token geçerli, işleme devam et
                return ResponseEntity.ok("Başarılı");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Geçersiz token");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization header is missing or invalid");
        }
    }

}
