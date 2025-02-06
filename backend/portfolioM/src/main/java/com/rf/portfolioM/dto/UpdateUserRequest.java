package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.enums.ContactAddresses;
import com.rf.portfolioM.model.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.*;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    private String university;
    private String job;
    private String area;
    private String password;
    private String profilePhotoUrl;
    private String cvUrl;
    private String aboutMe;
    private Map<String, SkillLevel> skills;
    private Map<ContactAddresses, String> contactAddresses;
}
