package com.rf.portfolioM.model;
import com.rf.portfolioM.model.enums.ProjectArea;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "project_images",
            joinColumns = @JoinColumn(name = "project_id")
    )
    @Column(name = "image_url")
    @Size(max = 5)
    private List<String> imagesUrl;

    @Enumerated(EnumType.STRING)
    private ProjectArea projectArea;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "project-skills",  // Teknolojilerin saklanacağı tablo adı
            joinColumns = @JoinColumn(name = "project_id")
    )
    @Column(name = "skill")  // Teknolojilerin ismi
    private List<String> skills;

    @ManyToOne
    private User user;

    private String projectLink;

    @OneToMany(mappedBy = "project",cascade = CascadeType.ALL)
    private List<Comment> comments;
}
