package com.rf.portfolioM.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String dType) {
        super(dType+" Bulunamadi");
    }
}
