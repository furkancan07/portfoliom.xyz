package com.rf.portfolioM.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class SleepController {
    @GetMapping("/isSleep")
    public ResponseEntity<?> ok(){
        return ResponseEntity.ok("Serverin uyumasını engelle");
    }
}
