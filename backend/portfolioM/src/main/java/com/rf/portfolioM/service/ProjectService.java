package com.rf.portfolioM.service;

import com.rf.portfolioM.dto.AddProjectRequest;
import com.rf.portfolioM.dto.ProjectDto;
import com.rf.portfolioM.dto.ProjectReOrderRequest;
import com.rf.portfolioM.dto.UpdateProjectRequest;
import com.rf.portfolioM.dto.converter.DtoConverter;
import com.rf.portfolioM.exception.BadRequestException;
import com.rf.portfolioM.exception.FailedToFieldException;
import com.rf.portfolioM.exception.NotFoundException;
import com.rf.portfolioM.model.Project;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.model.enums.ProjectArea;
import com.rf.portfolioM.repository.ProjectRepository;
import com.rf.portfolioM.security.UserIdentityManager;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
        int countMax=repository.countByUserId(user.getId());
        Project project = Project.builder().user(user).projectLink(request.getProjectLink()).projectArea(request.getProjectArea())
                .description(request.getDescription())
                .skills(request.getSkills())
                .name(request.getName()).orderIndex(countMax).build();

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
        List<Project> projects=repository.findByUserIdOrderByOrderIndexAsc(userId);
        return ApiResponse.ok("Projeler",projects.stream().map(converter::convertProject).collect(Collectors.toList()));
    }

    public ApiResponse<List<ProjectDto>> getProjectsByUserAndTag(String userId, ProjectArea tag) {
        List<Project> projects=repository.findByUserIdAndProjectAreaOrderByOrderIndex(userId,tag);
        return ApiResponse.ok(tag+" Projeleri",projects.stream().map(converter::convertProject).collect(Collectors.toList()));
    }

    protected Project findById(String projectId) {
       return repository.findById(projectId).orElseThrow(()->new NotFoundException("Proje"));
    }

    public ApiResponse<ProjectDto> updateProject(String id, UpdateProjectRequest request) {
        Project project = getProjectById(id);

        boolean updated = false;

        if (!project.getProjectArea().equals(request.getProjectArea())) {
            project.setProjectArea(request.getProjectArea());
            updated = true;
        }
        if (!project.getName().equals(request.getName())) {
            project.setName(request.getName());
            updated = true;
        }
        if (!project.getProjectLink().equals(request.getProjectLink())) {
            project.setProjectLink(request.getProjectLink());
            updated = true;
        }
        if (!project.getSkills().equals(request.getSkills())) {
            project.setSkills(request.getSkills());
            updated = true;
        }
        if (!project.getDescription().equals(request.getDescription())) {
            project.setDescription(request.getDescription());
            updated = true;
        }

        if (updated) {
            repository.save(project);
        }

        return ApiResponse.ok("Proje güncellendi", converter.convertProject(project));
    }

    @Transactional
    public ApiResponse<List<ProjectDto>> updateProjectOrder(ProjectReOrderRequest request) {
        User user = manager.getAuthenticatedUser();

        List<Project> projects = repository.findByUserId(user.getId());
        List<String> projectIds = request.getProjectIds();

        if (projects.size() != projectIds.size()) {
            throw new BadRequestException("Tekrar Deneyin...");
        }

        // O(n) HashMap kullanımı
        Map<String, Project> projectMap = projects.stream()
                .collect(Collectors.toMap(Project::getId, p -> p));

        List<Project> updatedProjects = new ArrayList<>();

        for (int i = 0; i < projectIds.size(); i++) {
            Project project = projectMap.get(projectIds.get(i));
            if (project != null && project.getOrderIndex() != i) {
                project.setOrderIndex(i);
                updatedProjects.add(project);
            }
        }

        if (!updatedProjects.isEmpty()) {
            repository.saveAll(updatedProjects);
        }

        return ApiResponse.ok("Sıralama güncellendi",
                updatedProjects.stream().map(converter::convertProject).collect(Collectors.toList()));
    }

}
