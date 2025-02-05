package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.UserDto;
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
    User save(@RequestBody UserDto user){
        User user1=new User();
        user1.setName(user.getName());
        user1.setSkills(user.getSkills());
        user1.setContactAddresses(user.getContactAdresses());
        repository.save(user1);
        return user1;

    }
}
