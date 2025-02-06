package com.rf.portfolioM.exception;

public class CloudinaryException extends RuntimeException{
    public CloudinaryException(String contentType) {
        super("Desteklenmeyen dosya türü "+ contentType );
    }
}
