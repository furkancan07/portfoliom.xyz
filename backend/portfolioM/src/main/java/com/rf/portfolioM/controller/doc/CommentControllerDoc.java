package com.rf.portfolioM.controller.doc;

import com.rf.portfolioM.dto.AddCommentRequest;
import com.rf.portfolioM.dto.CommentDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@Tag(name = "Comment API", description = "Yorum işlemleri")
public interface CommentControllerDoc {

    @Operation(summary = "Yorum ekle",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Ekleme başarılı"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Doğrulama/İstek hatası",
                            content = @Content(schema = @Schema(example = "{\\n  \\\"status\\\":400,\\n  \\\"message\\\":\\\"Doğrulama Hatası\\\"\\n}"))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Proje bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<Void> addComment(
            @Parameter(description = "Proje ID") String projectId,
            @Parameter(schema = @Schema(implementation = AddCommentRequest.class)) AddCommentRequest request
    );

    @Operation(summary = "Yorum sil",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Silme başarılı"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Yorum bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<Void> deleteComment(@Parameter(description = "Yorum ID") String id);

    @Operation(summary = "Yorum güncelle",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Güncelleme başarılı",
                            content = @Content(schema = @Schema(implementation = CommentDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Doğrulama/İstek hatası"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Yorum/Proje bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<CommentDto> updateComment(
            @Parameter(description = "Yorum ID") String id,
            @Parameter(schema = @Schema(implementation = AddCommentRequest.class)) AddCommentRequest request
    );

    @Operation(summary = "Projeye ait yorumları getir",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Başarılı",
                            content = @Content(schema = @Schema(implementation = CommentDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Proje bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<List<CommentDto>> getCommentsByProject(@Parameter(description = "Proje ID") String id);
}


