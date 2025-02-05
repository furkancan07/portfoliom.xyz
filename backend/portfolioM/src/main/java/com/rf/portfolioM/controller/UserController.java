package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.CreateUserRequest;
import com.rf.portfolioM.dto.UserDto;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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
  //  private final UserService service;
    // kullanıcı oluştur
  @PostMapping(value = ApiPaths.CREATE,consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @Operation(
          summary = "Kullanıcı oluştur",
          description = "Kullanıcı bilgilerini ve profil resmini alarak kaydeder."
  )
  public ResponseEntity<ApiResponse<UserDto>> save(
          @Valid @RequestBody CreateUserRequest request,
          @RequestParam MultipartFile file) {
      return null; // İşlem burada yapılacak
  }




    // kullanıcı sil

    // kullanıcı güncelle

    // profil fotosu güncelle ->supabase

    // cv ekle

    // skill ekle

    // iletişim adresi ekle


}
