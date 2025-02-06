package com.rf.portfolioM.exception;

public class FailedToFieldException extends RuntimeException {
    public FailedToFieldException() {
        super("Dosya yüklenemedi");
    }
}
