package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.model.enums.ProjectArea;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProjectRequest {
    private String name;
    private String description;
    private ProjectArea projectArea;
    private List<String> skills;
    private String projectLink;
}
