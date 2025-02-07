package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.AddProjectRequest;
import com.rf.portfolioM.dto.ProjectDto;
import com.rf.portfolioM.model.enums.ProjectArea;
import com.rf.portfolioM.service.ProjectService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(ApiPaths.PROJECT)
public class ProjectController {
    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }
    // kullanıcıya ait tüm projeleri getir
    @GetMapping(ApiPaths.PROJECT_BY_USER)
    ResponseEntity<ApiResponse<List<ProjectDto>>> getProjectsByUser(@PathVariable String userId){
        return ResponseEntity.ok(service.getProjectsByUser(userId));
    }
    // kullanıcının taga göre proje getir örn web
@GetMapping(ApiPaths.GET_PROJECT_BY_USER_AND_TAG)
ResponseEntity<ApiResponse<List<ProjectDto>>> getProjectsByUserAndTag(@PathVariable String userId, @PathVariable ProjectArea tag){
        return ResponseEntity.ok(service.getProjectsByUserAndTag(userId,tag));
}
    // proje getir idye göre
    @GetMapping(ApiPaths.ID)
    ResponseEntity<ApiResponse<ProjectDto>> getProject(@PathVariable String id){
        return ResponseEntity.ok(service.getProject(id));
    }
    // proje ekle
    @PostMapping(ApiPaths.CREATE+"/{userId}")
    ResponseEntity<ApiResponse<ProjectDto>> createProject(@PathVariable String userId, @RequestPart("request") @Valid AddProjectRequest request, @RequestPart(value = "file",required = false) List<MultipartFile> file){
        return ResponseEntity.ok(service.createProject(userId,request,file));
    }

    // proje sil
    @DeleteMapping(ApiPaths.DELETE)
    ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id){
        return ResponseEntity.ok(service.delete(id));
    }





}
