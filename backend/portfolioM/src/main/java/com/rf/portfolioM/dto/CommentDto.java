package com.rf.portfolioM.dto;
import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    private String id;
    private ProjectDto project;
    private UserInformation user;
    private String comment;
}
