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
public class ExperienceController implements com.rf.portfolioM.controller.doc.ExperienceControllerDoc {
    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    // kullanıcya ait deneyimleri getirme
    @GetMapping("/{username}")
    public ApiResponse<List<ExperienceDto>> getExperiences(@PathVariable String username){
        return experienceService.list(username);
    }
    @DeleteMapping(ApiPaths.DELETE)
    public ApiResponse<Void> deleteExperience(@PathVariable String id){
        return experienceService.delete(id);
    }
    @PutMapping(ApiPaths.UPDATE)
    public ApiResponse<ExperienceDto> updateExperience(@PathVariable String id, @RequestBody UpdateExperienceRequest request)
    {
        return experienceService.updateExperience(request,id);
    }
}
