package com.rf.portfolioM.controller.doc;

import com.rf.portfolioM.dto.AuthResponse;
import com.rf.portfolioM.dto.LoginRequest;
import com.rf.portfolioM.utils.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Authentication API", description = "Kullanıcı giriş işlemleri ve token üretimi")
public interface AuthControllerDoc {

    @Operation(
            summary = "Kullanıcı girişi",
            description = "Kullanıcının kullanıcı adı ve şifre ile giriş yapmasını sağlar. Başarılı olduğunda JWT token ve kullanıcı bilgileri döner.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Giriş başarılı",
                            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Doğrulama hatası",
                            content = @Content(schema = @Schema(example = "{\\n  \\\"status\\\":400,\\n  \\\"path\\\":\\\"/api/v1/auth/login\\\",\\n  \\\"message\\\":\\\"Doğrulama Hatası\\\",\\n  \\\"errors\\\": { \\\"username\\\": \\\"zorunlu\\\" },\\n  \\\"localDateTime\\\": \\\"2025-01-01T12:00:00\\\"\\n}"))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Geçersiz kimlik bilgileri"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Sunucu hatası")
            }
    )
    ResponseEntity<ApiResponse<AuthResponse>> login(
            @Parameter(description = "Giriş bilgileri", required = true,
                    schema = @Schema(implementation = LoginRequest.class,
                            example = "{\\n  \\\"username\\\": \\\"furkan\\\",\\n  \\\"password\\\": \\\"Sifre123!\\\"\\n}"))
            LoginRequest request
    );
}


