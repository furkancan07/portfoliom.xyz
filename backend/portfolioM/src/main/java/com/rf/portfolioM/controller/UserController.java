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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(ApiPaths.USER)
@RequiredArgsConstructor
public class UserController {
    private final UserService service;
    private final CloudinaryService cloudinaryService;
    // kullanıcı oluştur

    @PostMapping(value = ApiPaths.CREATE)
     @Operation(

            summary = "Kullanıcı oluştur",
            description = "Bu endpoint, yeni bir kullanıcıyı profil fotoğrafı ile birlikte oluşturmanızı sağlar. \" +\n" +
                    "                    \"'request' kısmı 'application/json' Content-Type ile gönderilmelidir. \" +\n" +
                    "                    \"Bu API'yi Postman üzerinden test ederken, 'request' kısmını 'application/json' olarak, 'file' kısmını ise boş bırakabilirsiniz.Not : Swagger üzerinde çalışmıyor !!!"
    )
    public ResponseEntity<ApiResponse<Void>> save(
            @RequestPart("request") @Valid CreateUserRequest request,  // CreateUserRequest parametresi
            @RequestPart(value = "file", required = false) MultipartFile file) {  // Fotoğraf parametresi
        return ResponseEntity.ok(service.createUser(request, file));
    }
    // kullanıcı sil
    @DeleteMapping(ApiPaths.DELETE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id){
        return ResponseEntity.ok(service.deleteUser(id));
    }
    // kullanıcı güncelle
    @PutMapping(ApiPaths.UPDATE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(description = "Contact adresinde key değeri :  GITHUB,\n" +
            "    LINKEDIN,\n" +
            "    GMAIL,\n" +
            "    WEBSITE,\n" +
            "    TWITTER,\n" +
            "    INSTAGRAM,\n" +
            "    FACEBOOK,\n" +
            "    SLACK,\n" +
            "    DEVTO,\n" +
            "    STACKOVERFLOW,\n" +
            "    DISCORD,\n" +
            "    MEDIUM,\n" +
            "    LEETCODE,\n" +
            "    HACKERRANK,\n" +
            "    OTHER  bunlardan biri olmalı")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable String id, @Valid @RequestBody UpdateUserRequest request){
        return ResponseEntity.ok(service.updateUser(id,request));
    }

    // profil fotosu güncelle
    @PatchMapping(value = ApiPaths.UPDATE_PROFILE_PHOTO,consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateProfilePhoto(@PathVariable String id,@RequestParam(value = "file",required = false) MultipartFile file){
        return ResponseEntity.ok(service.updateProfilePhoto(id,file));
    }
    // profil fotosunu sil
    @DeleteMapping(ApiPaths.DELETE_PROFILE_PHOTO)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProfilePhoto(@RequestParam("url") String url){
        return ResponseEntity.ok(service.deleteProfilePhoto(url));
    }
    // cv ekle
    @PatchMapping(value = ApiPaths.UPLOAD_CV,consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> uploadCv(@PathVariable String userId,@RequestParam(value = "file",required = false) MultipartFile file){
        return ResponseEntity.ok(service.uploadCv(userId,file));
    }
    // skill ekle
    @PatchMapping(ApiPaths.ADD_SKILL)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> addSkillForUser(@RequestBody AddSkillRequest request){
        return ResponseEntity.ok(service.addSkill(request));
    }
    // iletişim adresi ekle
    @PatchMapping(ApiPaths.ADD_CONTACT)
    @Operation(summary = "iletişim adresi ekleme",description = "  GITHUB,\n" +
            "    LINKEDIN,\n" +
            "    GMAIL,\n" +
            "    WEBSITE,\n" +
            "    TWITTER,\n" +
            "    INSTAGRAM,\n" +
            "    FACEBOOK,\n" +
            "    SLACK,\n" +
            "    DEVTO,\n" +
            "    STACKOVERFLOW,\n" +
            "    DISCORD,\n" +
            "    MEDIUM,\n" +
            "    LEETCODE,\n" +
            "    HACKERRANK,\n" +
            "    OTHER \n" +" mapte key değerleri bu değerler dışında değer almamalı"  )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> addContactAddresses(@RequestBody AddContactAddressesRequest request, @PathVariable String id){
        return ResponseEntity.ok(service.addContactAddresses(request,id));
    }

    // useri getir username
    @GetMapping(ApiPaths.USER_BY_USERNAME)
    ResponseEntity<ApiResponse<UserDto>> findByUserName(@PathVariable String username){
        return ResponseEntity.ok(service.getUserByUsername(username));
    }

    // useri getir id
    @GetMapping(ApiPaths.ID)
    ResponseEntity<ApiResponse<UserDto>> findByUserId(@PathVariable String id){
        return ResponseEntity.ok(service.getUserById(id));
    }
    // user listesi
    @GetMapping(ApiPaths.LIST)
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers(){
        return ResponseEntity.ok(service.getUsers());
    }




}
