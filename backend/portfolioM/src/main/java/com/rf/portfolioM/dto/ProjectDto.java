package com.rf.portfolioM.dto;
import com.rf.portfolioM.model.enums.ProjectArea;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {
    private String id;
    private String name;
    private String description;
    @Builder.Default
    private List<String> imagesUrl = new ArrayList<>();
    private ProjectArea projectArea;
    @Builder.Default
    private List<String> skills = new ArrayList<>();
    private UserInformation user;
    private String projectLink;

}
