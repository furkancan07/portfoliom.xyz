package com.rf.portfolioM.dto;
import com.rf.portfolioM.validatiom.UniqueEmail;
import com.rf.portfolioM.validatiom.UniqueUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest {
    @NonNull
    @Size(min = 4,max = 85)
    @UniqueUser
    private String username;
    @NonNull
    private String name;
    @NonNull
    private String surname;
    @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$" ,message = "Lütfen en az bir büyük harf,bir küçük harf ve sayi kullanin")
    private String password;
    @Email
    @UniqueEmail
    private String email;
    private String profilePhotoUrl;
}
