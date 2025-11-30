package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.*;
import com.rf.portfolioM.service.CloudinaryService;
import com.rf.portfolioM.service.UserService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(ApiPaths.USER)
@RequiredArgsConstructor
public class UserController implements com.rf.portfolioM.controller.doc.UserControllerDoc {
    private final UserService service;
    private final CloudinaryService cloudinaryService;

    // Kullanıcı oluştur
    @PostMapping(value = ApiPaths.CREATE)
    @Operation(summary = "Kullanıcı oluştur", description = """
            Bu endpoint, yeni bir kullanıcıyı profil fotoğrafı ile birlikte oluşturmanızı sağlar.
            'request' kısmı 'application/json' Content-Type ile gönderilmelidir.
            Bu API'yi Postman üzerinden test ederken, 'request' kısmını 'application/json' olarak, 
            'file' kısmını ise boş bırakabilirsiniz. Not: Swagger üzerinde çalışmıyor!!!
            """)
    public ApiResponse<Void> save(
            @RequestPart("request") @Valid CreateUserRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return service.createUser(request, file);
    }

    // Kullanıcı sil
    @DeleteMapping(ApiPaths.DELETE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> deleteUser(@PathVariable String id) {
        return service.deleteUser(id);
    }

    // Kullanıcı güncelle
    @PutMapping(ApiPaths.USER_UPDATE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(description = """
            Contact adresinde key değeri şunlardan biri olmalı:  
            GITHUB, LINKEDIN, GMAIL, WEBSITE, TWITTER, INSTAGRAM, FACEBOOK, SLACK,  
            DEVTO, STACKOVERFLOW, DISCORD, MEDIUM, LEETCODE, HACKERRANK, OTHER
            """)
    public ApiResponse<UserDto> updateUser(@Valid @RequestBody UpdateUserRequest request) {
        return service.updateUser(request);
    }

    // Profil fotosu güncelle
    @PatchMapping(value = ApiPaths.UPDATE_PROFILE_PHOTO, consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> updateProfilePhoto(@RequestParam(value = "file", required = false) MultipartFile file) {
        return service.updateProfilePhoto(file);
    }

    // Profil fotosunu sil
    @DeleteMapping(ApiPaths.DELETE_PROFILE_PHOTO)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> deleteProfilePhoto(@RequestParam("url") String url) {
        return service.deleteProfilePhoto(url);
    }

    // CV ekle
    @PatchMapping(value = ApiPaths.UPLOAD_CV, consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> uploadCv(@RequestParam(value = "file", required = false) MultipartFile file) {
        return service.uploadCv(file);
    }

    // Skill ekle
    @PatchMapping(ApiPaths.ADD_SKILL)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> addSkillForUser(@RequestBody AddSkillRequest request) {
        return service.addSkill(request);
    }

    // İletişim adresi ekle
    @PatchMapping(ApiPaths.ADD_CONTACT)
    @Operation(summary = "İletişim adresi ekleme", description = """
            Map içinde key olarak şu değerler kullanılmalıdır:
            GITHUB, LINKEDIN, GMAIL, WEBSITE, TWITTER, INSTAGRAM, FACEBOOK, SLACK,  
            DEVTO, STACKOVERFLOW, DISCORD, MEDIUM, LEETCODE, HACKERRANK, OTHER
            """)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> addContactAddresses(@RequestBody AddContactAddressesRequest request) {
        return service.addContactAddresses(request);
    }

    // Kullanıcı getir (username)
    @GetMapping(ApiPaths.USER_BY_USERNAME)
    public ApiResponse<UserDto> findByUserName(@PathVariable String username) {
        return service.getUserByUsername(username);
    }

    // Kullanıcı getir (ID)
    @GetMapping(ApiPaths.ID)
    public ApiResponse<UserDto> findByUserId(@PathVariable String id) {
        return service.getUserById(id);
    }

    // Kullanıcı listesi
    @GetMapping(ApiPaths.LIST)
    public ApiResponse<List<UserDto>> getUsers() {
        return service.getUsers();
    }

    // İsme göre kullanıcı arama
    @GetMapping(ApiPaths.SEARCH_USER)
    public ApiResponse<List<UserInformation>> searchUser(@PathVariable String username) {
        return service.searchUser(username);
    }

    // Mevcut kullanıcıyı getir
    @GetMapping("/me")
    public ApiResponse<UserDto> getCurrentUser() {
        return service.getCurrentUser();
    }
}
