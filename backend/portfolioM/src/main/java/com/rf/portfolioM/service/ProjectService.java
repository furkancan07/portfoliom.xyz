package com.rf.portfolioM.service;

import com.rf.portfolioM.dto.AddProjectRequest;
import com.rf.portfolioM.dto.ProjectDto;
import com.rf.portfolioM.dto.UpdateProjectRequest;
import com.rf.portfolioM.dto.converter.DtoConverter;
import com.rf.portfolioM.exception.FailedToFieldException;
import com.rf.portfolioM.exception.NotFoundException;
import com.rf.portfolioM.model.Project;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.model.enums.ProjectArea;
import com.rf.portfolioM.repository.ProjectRepository;
import com.rf.portfolioM.security.UserIdentityManager;
import com.rf.portfolioM.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository repository;
    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private final DtoConverter converter;
private final UserIdentityManager manager;
    public ApiResponse<ProjectDto> createProject(AddProjectRequest request, List<MultipartFile> files) {
        User user = manager.getAuthenticatedUser();
        Project project = Project.builder().user(user).projectLink(request.getProjectLink()).projectArea(request.getProjectArea())
                .description(request.getDescription())
                .skills(request.getSkills())
                .name(request.getName()).build();
        System.out.println(request.getSkills().toString());
        List<String> urls = getUrls(files);
        project.setImagesUrl(urls);
        repository.save(project);
        return ApiResponse.ok("Proje eklendi", converter.convertProject(project));
    }

    private List<String> getUrls(List<MultipartFile> files) {
        List<String> url = null;
        if (files != null && !files.isEmpty()) {
            try {
                url = cloudinaryService.uploadFiles(files);
            } catch (IOException e) {
                throw new FailedToFieldException();
            }
        }
        return url;
    }

    public ApiResponse<Void> delete(String id) {
        Project project=getProjectById(id);
        repository.delete(project);
        return ApiResponse.ok("Proje Silindi");
    }
    public ApiResponse<ProjectDto> getProject(String id) {
        return ApiResponse.ok("Proje Bilgisi",converter.convertProject(getProjectById(id)));
    }
    protected Project getProjectById(String id){
      return   repository.findById(id).orElseThrow(()-> new NotFoundException("Proje "));
    }

    public ApiResponse<List<ProjectDto>> getProjectsByUser(String userId) {
        List<Project> projects=repository.findByUserId(userId);
        return ApiResponse.ok("Projeler",projects.stream().map(converter::convertProject).collect(Collectors.toList()));
    }

    public ApiResponse<List<ProjectDto>> getProjectsByUserAndTag(String userId, ProjectArea tag) {
        List<Project> projects=repository.findByUserIdAndProjectArea(userId,tag);
        return ApiResponse.ok(tag+" Projeleri",projects.stream().map(converter::convertProject).collect(Collectors.toList()));
    }

    protected Project findById(String projectId) {
       return repository.findById(projectId).orElseThrow(()->new NotFoundException("Proje"));
    }

    public ApiResponse<ProjectDto> updateProject(String id, UpdateProjectRequest request) {
        Project project=findById(id);
        project.setProjectArea(request.getProjectArea());
        project.setName(request.getName());
        project.setProjectLink(request.getProjectLink());
        project.setSkills(request.getSkills());
        project.setDescription(request.getDescription());
        repository.save(project);
        return ApiResponse.ok("Proje güncellendi",converter.convertProject(project));
    }
}
