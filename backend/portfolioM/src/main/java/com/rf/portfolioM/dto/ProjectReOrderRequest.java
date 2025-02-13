package com.rf.portfolioM.dto;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectReOrderRequest {
    private List<String> projectIds;
}
