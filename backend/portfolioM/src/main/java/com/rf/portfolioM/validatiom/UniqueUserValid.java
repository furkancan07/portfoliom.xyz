package com.rf.portfolioM.validatiom;

import com.rf.portfolioM.service.UserService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UniqueUserValid implements ConstraintValidator<UniqueUser,String> {
    private final UserService service;

    public UniqueUserValid(UserService service) {
        this.service = service;
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        return !service.existByUserName(s);
    }
}
