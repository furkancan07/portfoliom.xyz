package com.rf.portfolioM.controller.doc;

import com.rf.portfolioM.dto.*;
import com.rf.portfolioM.model.enums.ProjectArea;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Project API", description = "Proje yönetimi")
public interface ProjectControllerDoc {

    @Operation(summary = "Kullanıcının projelerini getir",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Başarılı",
                            content = @Content(schema = @Schema(implementation = ProjectDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Kullanıcı bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<List<ProjectDto>> getProjectsByUser(@Parameter(description = "Kullanıcı ID") String userId);

    @Operation(summary = "Kullanıcının taga göre projelerini getir",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Başarılı"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Kullanıcı bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<List<ProjectDto>> getProjectsByUserAndTag(
            @Parameter(description = "Kullanıcı ID") String userId,
            @Parameter(description = "Etiket") ProjectArea tag);

    @Operation(summary = "Proje getir",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Başarılı",
                            content = @Content(schema = @Schema(implementation = ProjectDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Proje bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<ProjectDto> getProject(@Parameter(description = "Proje ID") String id);

    @Operation(summary = "Proje oluştur",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Oluşturma başarılı",
                            content = @Content(schema = @Schema(implementation = ProjectDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Doğrulama/İstek hatası"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "429", description = "Çok fazla istek")
            })
    com.rf.portfolioM.utils.ApiResponse<ProjectDto> createProject(
            @Parameter(schema = @Schema(implementation = AddProjectRequest.class)) AddProjectRequest request,
            @Parameter(description = "Proje görselleri") List<MultipartFile> file);

    @Operation(summary = "Proje sil",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Silme başarılı"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Proje bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<Void> deleteProject(@Parameter(description = "Proje ID") String id);

    @Operation(summary = "Proje güncelle",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Güncelleme başarılı",
                            content = @Content(schema = @Schema(implementation = ProjectDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Doğrulama/İstek hatası"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Proje bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<ProjectDto> updateProject(
            @Parameter(description = "Proje ID") String id,
            @Parameter(schema = @Schema(implementation = UpdateProjectRequest.class)) UpdateProjectRequest request);

    @Operation(summary = "Proje sırasını güncelle",
            security = @SecurityRequirement(name = "bearerAuth"))
    com.rf.portfolioM.utils.ApiResponse<List<ProjectDto>> updateProjectOrder(
            @Parameter(schema = @Schema(implementation = ProjectReOrderRequest.class)) ProjectReOrderRequest request);
}


