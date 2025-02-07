package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.enums.ProjectArea;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {
    private String id;
    private String name;
    private String description;
    private List<String> imagesUrl;
    private ProjectArea projectArea;
    private List<String> skills;
    private UserInformation user;
    private String projectLink;

}
