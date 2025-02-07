package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.enums.SkillLevel;
import lombok.*;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddSkillRequest {
    private Map<String, SkillLevel> skills;

}
