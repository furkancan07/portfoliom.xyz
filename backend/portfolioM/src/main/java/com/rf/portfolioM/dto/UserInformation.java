package com.rf.portfolioM.dto;
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

}
