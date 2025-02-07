package com.rf.portfolioM.exception;

public class OnlyImageException extends RuntimeException{
    public OnlyImageException() {
        super("Sadece resim dosyaları yükleyebilirsiniz! Desteklenen türler: JPEG, PNG, GIF, WEBP.");
    }
}
