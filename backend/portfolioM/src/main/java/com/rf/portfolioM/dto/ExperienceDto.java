package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.model.enums.Position;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExperienceDto {
    private String id;
    private String companyName;
    private LocalDate startTime;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    private Position position;
    private UserInformation user;
}
