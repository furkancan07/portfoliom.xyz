package com.rf.portfolioM.exception;

public class UserNotAuthenticatedException extends RuntimeException {
    public UserNotAuthenticatedException() {
        super("Lütfen giriş yapın");
    }
}
