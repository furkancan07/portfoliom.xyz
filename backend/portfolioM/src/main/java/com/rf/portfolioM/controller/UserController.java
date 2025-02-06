package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.CreateUserRequest;
import com.rf.portfolioM.service.CloudinaryService;
import com.rf.portfolioM.service.UserService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(ApiPaths.USER)
@RequiredArgsConstructor
public class UserController {
    private final UserService service;
    private final CloudinaryService cloudinaryService;
    // kullanıcı oluştur

    @PostMapping(value = ApiPaths.CREATE
           )
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
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id){
        return ResponseEntity.ok(service.deleteUser(id));
    }
    // kullanıcı güncelle

    // profil fotosu güncelle
    @PatchMapping(value = ApiPaths.UPDATE_PROFILE_PHOTO,consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Void>> updateProfilePhoto(@PathVariable String id,@RequestParam(value = "file",required = false) MultipartFile file){
        return ResponseEntity.ok(service.updateProfilePhoto(id,file));
    }
    // profil fotosunu sil
    @DeleteMapping(ApiPaths.DELETE_PROFILE_PHOTO)
    public ResponseEntity<ApiResponse<Void>> deleteProfilePhoto(@RequestParam("url") String url){
        return ResponseEntity.ok(service.deleteProfilePhoto(url));
    }
    // cv ekle

    // skill ekle

    // iletişim adresi ekle


}
