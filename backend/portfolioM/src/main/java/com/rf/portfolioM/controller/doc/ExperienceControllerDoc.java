package com.rf.portfolioM.controller.doc;

import com.rf.portfolioM.dto.ExperienceDto;
import com.rf.portfolioM.dto.UpdateExperienceRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@Tag(name = "Experience API", description = "Deneyim yönetimi")
public interface ExperienceControllerDoc {

    @Operation(summary = "Kullanıcı deneyimlerini getir",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Başarılı",
                            content = @Content(schema = @Schema(implementation = ExperienceDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Kullanıcı bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<List<ExperienceDto>> getExperiences(@Parameter(description = "Kullanıcı adı") String username);

    @Operation(summary = "Deneyim sil",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Silme başarılı"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Deneyim bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<Void> deleteExperience(@Parameter(description = "Deneyim ID") String id);

    @Operation(summary = "Deneyim güncelle",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Güncelleme başarılı",
                            content = @Content(schema = @Schema(implementation = ExperienceDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Doğrulama/İstek hatası"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Deneyim bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<ExperienceDto> updateExperience(
            @Parameter(description = "Deneyim ID") String id,
            @Parameter(schema = @Schema(implementation = UpdateExperienceRequest.class)) UpdateExperienceRequest request);
}


