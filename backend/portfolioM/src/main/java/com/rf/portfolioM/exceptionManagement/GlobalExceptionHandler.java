package com.rf.portfolioM.exceptionManagement;

import com.rf.portfolioM.exception.CloudinaryException;
import com.rf.portfolioM.exception.FailedToFieldException;
import com.rf.portfolioM.exception.NotFoundException;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // validasyon hataları
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> validationException(MethodArgumentNotValidException ex, HttpServletRequest http){
        Map<String,String> errors=new HashMap<>();
        for(FieldError fieldError : ex.getFieldErrors()){
            errors.put(fieldError.getField(),fieldError.getDefaultMessage());
        }
        ApiResponse<Void> response=ApiResponse.<Void>builder().
                status(400).path(http.getRequestURI()).message("Doğrulama Hatası").errors(errors).localDateTime(LocalDateTime.now()).build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    // 404 hataları
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> notFoundException(RuntimeException ex,HttpServletRequest http){
        ApiResponse<Void> response=ApiResponse.<Void>builder().
                message(ex.getMessage()).status(404).path(http.getRequestURI()).localDateTime(LocalDateTime.now()).
                build();
        return ResponseEntity.status(404).body(response);
    }

    // 400 hataları
    @ExceptionHandler({FailedToFieldException.class, CloudinaryException.class,RuntimeException.class})
    public ResponseEntity<ApiResponse<Void>> badRequestException(RuntimeException ex,HttpServletRequest http){
        ApiResponse<Void> response=ApiResponse.<Void>builder().
                message(ex.getMessage()).status(400).path(http.getRequestURI()).localDateTime(LocalDateTime.now()).
                build();
        return ResponseEntity.badRequest().body(response);
    }
}
