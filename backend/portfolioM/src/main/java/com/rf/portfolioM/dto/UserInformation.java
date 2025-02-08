package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.enums.ROLE;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInformation {
    private String id;
    private String username;
    private String name;
    private String surname;
    private String profilePhotoUrl;
    @Enumerated(EnumType.STRING)
    private ROLE role;

}
