package com.rf.portfolioM.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.rf.portfolioM.model.enums.ProjectArea;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddProjectRequest {
    private String name;
    private String description;
    private ProjectArea projectArea;
    @JsonProperty("skills")
    private List<String> skills;
    private String projectLink;
}
