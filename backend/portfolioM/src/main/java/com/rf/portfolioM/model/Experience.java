package com.rf.portfolioM.model;

import com.rf.portfolioM.model.enums.Position;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String companyName;
    private LocalDate startTime;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    private Position position;

    @ManyToOne
    private User user;
}
