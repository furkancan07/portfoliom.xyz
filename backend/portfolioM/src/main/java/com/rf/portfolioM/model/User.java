package com.rf.portfolioM.model;
import com.rf.portfolioM.model.enums.ContactAddresses;
import com.rf.portfolioM.model.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "personel")
public class User  {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(unique = true)
    private String username;

    private String name;
    private String surname;

    private String university;
    private String job;
    private String area;
    @Column(unique = true)
    private String email;
    private String password;

    private String profilePhotoUrl;

    private String cvUrl;

    private String aboutMe;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "skills",  // Yetenekler tablosunun adı
            joinColumns = @JoinColumn(name = "user_id")
    )
    @MapKeyColumn(name = "skill")
    @Enumerated(EnumType.STRING)
    @Column(name = "skill_level")
    private Map<String, SkillLevel> skills;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "contactAdresses",  // Yetenekler tablosunun adı
            joinColumns = @JoinColumn(name = "user_id")
    )

    @MapKeyColumn(name = "platform")
    @Enumerated(EnumType.STRING)
    @Column(name = "url")

    private Map<ContactAddresses, String> contactAddresses;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    private List<Project> projects;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    private List<Comment> comments;






}
