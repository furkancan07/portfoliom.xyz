package com.rf.portfolioM.dto;

import com.rf.portfolioM.dto.UserInformation;
import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserInformation user;
}
