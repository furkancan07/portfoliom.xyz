package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.UserDtoExample;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/V1")
@RequiredArgsConstructor
public class denemeController {
    private final UserRepository repository;
    @PostMapping
    User save(@RequestBody UserDtoExample user){
        User user1= User.builder().
                name(user.getName())
                        .skills(user.getSkills())
                                .contactAddresses(user.getContactAdresses()).

                build();
        repository.save(user1);
        return user1;

    }
}
