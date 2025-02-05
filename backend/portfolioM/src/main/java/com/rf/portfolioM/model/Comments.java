package com.rf.portfolioM.model;

import jakarta.persistence.*;
import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String comment;

    @ManyToOne
    private User user;

    @ManyToOne
    private Project project;
}
