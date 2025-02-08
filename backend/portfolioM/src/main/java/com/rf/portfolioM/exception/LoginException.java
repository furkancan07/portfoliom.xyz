package com.rf.portfolioM.exception;

public class LoginException extends RuntimeException {
    public LoginException() {
        super("Şifre veya kullanıcı adı yanlış");
    }
}
