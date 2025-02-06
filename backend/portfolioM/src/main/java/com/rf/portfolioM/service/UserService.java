package com.rf.portfolioM.service;

import com.rf.portfolioM.dto.CreateUserRequest;
import com.rf.portfolioM.exception.FailedToFieldException;
import com.rf.portfolioM.exception.NotFoundException;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.repository.UserRepository;
import com.rf.portfolioM.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final CloudinaryService cloudinaryService;
    public ApiResponse<Void> createUser(CreateUserRequest request, MultipartFile file){
        String profilePhotoUrl=getUrl(file);
        User user=User.builder().name(request.getName()).surname(request.getSurname()).email(request.getEmail())
                .password(request.getPassword()).username(request.getUsername()).profilePhotoUrl(profilePhotoUrl).build();

        repository.save(user);


        return ApiResponse.ok("Kayıt Başarılı");

    }
    public boolean existByUserName(String username){
        return repository.existsByUsername(username);
    }
    public boolean existByEmail(String email){
        return repository.existsByEmail(email);
    }

    protected boolean existById(String id){
     return repository.existsById(id);
    }

    public ApiResponse<Void> deleteUser(String id) {
        if(!repository.existsById(id)) throw new NotFoundException("Kullanici");
        repository.deleteById(id);
        return ApiResponse.ok("Kullanici silindi");
    }

    public ApiResponse<Void> updateProfilePhoto(String id, MultipartFile file) {
        User user=repository.findById(id).orElseThrow(()->new NotFoundException("Kullanıcı"));
        String photoUrl=getUrl(file);
        cloudinaryService.deleteFile(user.getProfilePhotoUrl());
        user.setProfilePhotoUrl(photoUrl);
        repository.save(user);
        return ApiResponse.ok("Profil Resmi Güncellendi");
    }
    private String getUrl(MultipartFile file){
        String profilePhotoUrl=null;
        if(file!=null && !file.isEmpty()){
            try {
                profilePhotoUrl = cloudinaryService.uploadFile(file);
            }catch (IOException e){
                throw new FailedToFieldException();
            }
        }
        return profilePhotoUrl;
    }

    public ApiResponse<Void> deleteProfilePhoto(String id) {
       String result= cloudinaryService.deleteFile(id);
        if ("ok".equals(result)) {
            return ApiResponse.ok("Dosya başarıyla silindi.");
        } else if ("not found".equals(result)) {
            throw new NotFoundException("Dosya zaten silinmiş veya bulunamadı.");
        } else {
            throw  new RuntimeException("Silme işlemi sırasında hata oluştu: " + result);
        }

    }
}
