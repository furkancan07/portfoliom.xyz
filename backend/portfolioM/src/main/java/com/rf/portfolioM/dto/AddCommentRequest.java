package com.rf.portfolioM.dto;
import jakarta.validation.constraints.Size;
import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddCommentRequest {
    @Size(min = 1)
    private String comment;
}
