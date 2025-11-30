package com.rf.portfolioM.controller.doc;

import com.rf.portfolioM.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "User API", description = "Kullanıcı yönetimi")
public interface UserControllerDoc {

    @Operation(summary = "Kullanıcı oluştur",
            description = "Yeni kullanıcıyı opsiyonel profil fotoğrafı ile birlikte oluşturur. 'request' alanı JSON olarak gönderilmelidir.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Oluşturma başarılı",
                            content = @Content(schema = @Schema(example = "{\\n  \\\"status\\\":200,\\n  \\\"path\\\":\\\"/api/v1/user/create\\\",\\n  \\\"message\\\":\\\"User created\\\",\\n  \\\"localDateTime\\\":\\\"2025-01-01T12:00:00\\\",\\n  \\\"data\\\": null\\n}"))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Doğrulama/İstek hatası",
                            content = @Content(schema = @Schema(example = "{\\n  \\\"status\\\":400,\\n  \\\"path\\\":\\\"/api/v1/user/create\\\",\\n  \\\"message\\\":\\\"Doğrulama Hatası\\\",\\n  \\\"errors\\\": {\\n    \\\"username\\\": \\\"en az 4 karakter\\\"\\n  },\\n  \\\"localDateTime\\\":\\\"2025-01-01T12:00:00\\\"\\n}"))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "429", description = "Çok fazla istek",
                            content = @Content(schema = @Schema(example = "{\\n  \\\"status\\\":429,\\n  \\\"path\\\":\\\"/api/v1/user/create\\\",\\n  \\\"message\\\":\\\"Too Many Requests\\\",\\n  \\\"localDateTime\\\":\\\"2025-01-01T12:00:00\\\"\\n}"))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Sunucu hatası",
                            content = @Content(schema = @Schema(example = "{\\n  \\\"status\\\":500,\\n  \\\"path\\\":\\\"/api/v1/user/create\\\",\\n  \\\"message\\\":\\\"Internal Server Error\\\",\\n  \\\"localDateTime\\\":\\\"2025-01-01T12:00:00\\\"\\n}")))
            })
    com.rf.portfolioM.utils.ApiResponse<Void> save(
            @Parameter(required = true, description = "Kullanıcı oluşturma isteği",
                    schema = @Schema(implementation = CreateUserRequest.class))
            CreateUserRequest request,
            @Parameter(description = "Profil fotoğrafı") MultipartFile file
    );

    @Operation(summary = "Kullanıcı sil",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Silme başarılı",
                            content = @Content(schema = @Schema(example = "{\\n  \\\"status\\\":200,\\n  \\\"message\\\":\\\"Deleted\\\"\\n}"))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Kullanıcı bulunamadı",
                            content = @Content(schema = @Schema(example = "{\\n  \\\"status\\\":404,\\n  \\\"message\\\":\\\"User not found\\\"\\n}")))
            })
    com.rf.portfolioM.utils.ApiResponse<Void> deleteUser(
            @Parameter(description = "Kullanıcı ID", example = "65f1a1b2c3d4e5f6a7b8c9d0") String id);

    @Operation(summary = "Kullanıcı güncelle",
            description = "Kullanıcı bilgilerini, yeteneklerini ve iletişim adreslerini günceller.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Güncelleme başarılı",
                            content = @Content(schema = @Schema(implementation = UserDto.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Doğrulama/İstek hatası"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Yetkisiz"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Kullanıcı bulunamadı")
            })
    com.rf.portfolioM.utils.ApiResponse<UserDto> updateUser(
            @Parameter(schema = @Schema(implementation = UpdateUserRequest.class)) UpdateUserRequest request);

    @Operation(summary = "Profil fotoğrafı güncelle",
            security = @SecurityRequirement(name = "bearerAuth"))
    com.rf.portfolioM.utils.ApiResponse<Void> updateProfilePhoto(@Parameter(description = "Yeni profil fotoğrafı") MultipartFile file);

    @Operation(summary = "Profil fotoğrafı sil",
            security = @SecurityRequirement(name = "bearerAuth"))
    com.rf.portfolioM.utils.ApiResponse<Void> deleteProfilePhoto(@Parameter(description = "Silinecek resmin Cloudinary URL'si") String url);

    @Operation(summary = "CV yükle",
            security = @SecurityRequirement(name = "bearerAuth"))
    com.rf.portfolioM.utils.ApiResponse<Void> uploadCv(@Parameter(description = "PDF dosyası") MultipartFile file);

    @Operation(summary = "Kullanıcıya skill ekle",
            security = @SecurityRequirement(name = "bearerAuth"))
    com.rf.portfolioM.utils.ApiResponse<Void> addSkillForUser(@Parameter(schema = @Schema(implementation = AddSkillRequest.class)) AddSkillRequest request);

    @Operation(summary = "İletişim adresleri ekle")
    com.rf.portfolioM.utils.ApiResponse<Void> addContactAddresses(@Parameter(schema = @Schema(implementation = AddContactAddressesRequest.class)) AddContactAddressesRequest request);

    @Operation(summary = "Kullanıcıyı kullanıcı adına göre getir")
    com.rf.portfolioM.utils.ApiResponse<UserDto> findByUserName(@Parameter(example = "furkancan") String username);

    @Operation(summary = "Kullanıcıyı ID'ye göre getir")
    com.rf.portfolioM.utils.ApiResponse<UserDto> findByUserId(@Parameter(example = "65f1a1b2c3d4e5f6a7b8c9d0") String id);

    @Operation(summary = "Kullanıcı listesini getir")
    com.rf.portfolioM.utils.ApiResponse<List<UserDto>> getUsers();

    @Operation(summary = "İsme göre kullanıcı ara")
    com.rf.portfolioM.utils.ApiResponse<List<UserInformation>> searchUser(@Parameter(example = "furkan") String username);
}


