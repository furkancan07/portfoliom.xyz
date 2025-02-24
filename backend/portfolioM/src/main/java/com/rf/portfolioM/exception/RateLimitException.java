package com.rf.portfolioM.exception;

public class RateLimitException extends RuntimeException {
    public RateLimitException(String ex) {
        super(ex);
    }
}
