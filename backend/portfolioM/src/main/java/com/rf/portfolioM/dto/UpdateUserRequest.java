package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.Experience;
import com.rf.portfolioM.model.enums.ContactAddresses;
import com.rf.portfolioM.model.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    private String name;
    private String surname;
    private String university;
    private String job;
    private String area;
    private String aboutMe;
    private Map<String, SkillLevel> skills;
    private Map<ContactAddresses, String> contactAddresses;
    private List<AddExperienceRequest> experiences;
}
