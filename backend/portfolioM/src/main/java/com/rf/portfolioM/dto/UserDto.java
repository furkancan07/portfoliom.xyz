package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.Experience;
import com.rf.portfolioM.model.enums.ContactAddresses;
import com.rf.portfolioM.model.enums.ROLE;
import com.rf.portfolioM.model.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String id;
    private String username;
    private String name;
    private String surname;
    private String university;
    private String job;
    private String area;
    private String email;
    private String profilePhotoUrl;
    @Enumerated(EnumType.STRING)
    private ROLE role;
    private String cvUrl;
    private String aboutMe;
    private Map<String, SkillLevel> skills;
    private Map<ContactAddresses, String> contactAddresses;

}
