package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.ExperienceDto;
import com.rf.portfolioM.dto.UpdateExperienceRequest;
import com.rf.portfolioM.service.ExperienceService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiPaths.EXPERIENCE)
public class ExperienceController {
    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    // kullanıcya ait deneyimleri getirme
    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<List<ExperienceDto>>> getExperiences(@PathVariable String username){
        return ResponseEntity.ok(experienceService.list(username));
    }
    @DeleteMapping(ApiPaths.DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable String id){
        return ResponseEntity.ok(experienceService.delete(id));
    }
    @PutMapping(ApiPaths.UPDATE)
    public ResponseEntity<ApiResponse<ExperienceDto>> updateExperience(@PathVariable String id, @RequestBody UpdateExperienceRequest request)
    {
        return ResponseEntity.ok(experienceService.updateExperience(request,id));
    }
}
