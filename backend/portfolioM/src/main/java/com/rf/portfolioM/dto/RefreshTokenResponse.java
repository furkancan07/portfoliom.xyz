package com.rf.portfolioM.dto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenResponse {
    private String refreshToken;
    @JsonIgnore
    private String accessToken;
    private String message;
}
