package com.rf.portfolioM.controller;

import com.cloudinary.Api;
import com.rf.portfolioM.dto.AuthResponse;
import com.rf.portfolioM.dto.LoginRequest;
import com.rf.portfolioM.controller.doc.AuthControllerDoc;
import com.rf.portfolioM.dto.RefreshTokenResponse;
import com.rf.portfolioM.service.AuthService;
import com.rf.portfolioM.service.JwtService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPaths.AUTH)

public class AuthController implements AuthControllerDoc {
    private final AuthService service;
    private final JwtService jwtService;
    private final AuthService authService;

    public AuthController(AuthService service, JwtService jwtService, AuthService authService) {
        this.service = service;
        this.jwtService = jwtService;
        this.authService = authService;
    }

    // login
    @PostMapping(ApiPaths.LOGIN)
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {

        AuthResponse response = service.login(request);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", response.getToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(15 * 60)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(30L * 24 * 60 * 60)
                .build();


        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(ApiResponse.ok("Giriş Başarılı", response));
    }
    @PostMapping(ApiPaths.REFRESH)
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshCookie
    ) {


        RefreshTokenResponse response = service.refreshToken(refreshCookie);


        ResponseCookie accessCookie = ResponseCookie.from("accessToken", response.getAccessToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(15 * 60)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(30L * 24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(ApiResponse.ok("Token yenilendi", response));
    }
    @DeleteMapping(ApiPaths.LOGOUT)
    public ResponseEntity<ApiResponse<String>> logout( @CookieValue(name = "refreshToken", required = false) String refreshCookie){
        String response=authService.logout(refreshCookie);
        ResponseCookie clearAccessCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie clearRefreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearAccessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, clearRefreshCookie.toString())
                .body(ApiResponse.ok(response, null));
    }


}
