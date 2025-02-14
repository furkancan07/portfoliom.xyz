package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.enums.Position;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateExperienceRequest {
    private String companyName;
    private LocalDate startTime;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    private Position position;
}
