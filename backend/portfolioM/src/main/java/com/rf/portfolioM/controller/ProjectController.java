package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.AddProjectRequest;
import com.rf.portfolioM.dto.ProjectDto;
import com.rf.portfolioM.dto.ProjectReOrderRequest;
import com.rf.portfolioM.dto.UpdateProjectRequest;
import com.rf.portfolioM.model.enums.ProjectArea;
import com.rf.portfolioM.service.ProjectService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(ApiPaths.PROJECT)
public class ProjectController implements com.rf.portfolioM.controller.doc.ProjectControllerDoc {
    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    // Kullanıcıya ait tüm projeleri getir
    @GetMapping(ApiPaths.PROJECT_BY_USER)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<List<ProjectDto>> getProjectsByUser(@PathVariable String userId) {
        return service.getProjectsByUser(userId);
    }

    // Kullanıcının taga göre projelerini getir
    @GetMapping(ApiPaths.GET_PROJECT_BY_USER_AND_TAG)
    public ApiResponse<List<ProjectDto>> getProjectsByUserAndTag(@PathVariable String userId, @PathVariable ProjectArea tag) {
        return service.getProjectsByUserAndTag(userId, tag);
    }

    // ID'ye göre proje getir
    @GetMapping(ApiPaths.ID)
    public ApiResponse<ProjectDto> getProject(@PathVariable String id) {
        return service.getProject(id);
    }

    // Proje ekle
    @PostMapping(ApiPaths.CREATE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<ProjectDto> createProject(
            @RequestPart("request") @Valid AddProjectRequest request,
            @RequestPart(value = "file", required = false) List<MultipartFile> file) {
        return service.createProject(request, file);
    }

    // Proje sil
    @DeleteMapping(ApiPaths.DELETE)

    public ApiResponse<Void> deleteProject(@PathVariable String id) {
        return service.delete(id);
    }

    // Proje güncelle
    @PutMapping(ApiPaths.UPDATE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<ProjectDto> updateProject(@PathVariable String id, @RequestBody UpdateProjectRequest request) {
        return service.updateProject(id, request);
    }

    // Sürükle bırak ile proje sırasını değiştir
    @PutMapping(ApiPaths.REORDER)
    public ApiResponse<List<ProjectDto>> updateProjectOrder(@RequestBody ProjectReOrderRequest request) {
        return service.updateProjectOrder(request);
    }
}
