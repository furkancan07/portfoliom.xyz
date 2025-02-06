package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.enums.ContactAddresses;
import com.rf.portfolioM.model.enums.SkillLevel;
import lombok.*;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoExample {
    private String name;
    private Map<String, SkillLevel> skills;
    private Map<ContactAddresses, String> contactAdresses;
}
