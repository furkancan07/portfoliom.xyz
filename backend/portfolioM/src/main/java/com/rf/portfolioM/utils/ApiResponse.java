package com.rf.portfolioM.utils;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class ApiResponse <T> {
    private int status;
    private String path;
    private String message;
    private String localDateTime;
    private Map<String,String> errors=new HashMap<>();
    private T data;

    public static  <T>ApiResponse<T> ok(String message){
        return ApiResponse.<T>builder().status(200).message(message).localDateTime(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)).build();
    }

    public static  <T>ApiResponse<T> ok(String message,T data){
        return ApiResponse.<T>builder().status(200).message(message).localDateTime(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)).data(data).build();

    }
}