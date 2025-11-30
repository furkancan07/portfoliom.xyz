package com.rf.portfolioM.service;

import com.rf.portfolioM.dto.*;
import com.rf.portfolioM.dto.converter.DtoConverter;
import com.rf.portfolioM.exception.FailedToFieldException;
import com.rf.portfolioM.exception.NotFoundException;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.model.enums.ROLE;
import com.rf.portfolioM.repository.UserRepository;
import com.rf.portfolioM.security.UserIdentityManager;
import com.rf.portfolioM.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository repository;
    private final CloudinaryService cloudinaryService;
    private final DtoConverter converter;
    private final PasswordEncoder encoder;
    private final UserIdentityManager manager;
    private final ExperienceService experienceService;
    public ApiResponse<Void> createUser(CreateUserRequest request, MultipartFile file){
        String profilePhotoUrl=getUrl(file);
        User user=User.builder().name(request.getName()).surname(request.getSurname()).email(request.getEmail())
                .password(encoder.encode(request.getPassword())).username(request.getUsername()).profilePhotoUrl(profilePhotoUrl).build();
        user.setRole(ROLE.ROLE_USER);
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

    public ApiResponse<Void> updateProfilePhoto(MultipartFile file) {
        User user=manager.getAuthenticatedUser();
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

    public ApiResponse<UserDto> updateUser( UpdateUserRequest request) {
        User user=manager.getAuthenticatedUser();
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setUniversity(request.getUniversity());
        user.setJob(request.getJob());
        user.setArea(request.getArea());
        user.setSkills(request.getSkills());
        user.setContactAddresses(request.getContactAddresses());
        user.setAboutMe(request.getAboutMe());
        user.setExperiences(experienceService.saveExperiences(request.getExperiences()));
        repository.save(user);
        UserDto userDto=converter.convertUser(user);
        return ApiResponse.ok("Kullanici Bilgileri Güncellendi",userDto);
    }

    public ApiResponse<Void> uploadCv(MultipartFile file) {
        User user=manager.getAuthenticatedUser();
        String oldCvdUrl=user.getCvUrl();
        String cvUrl=getUrl(file);
        user.setCvUrl(cvUrl);
        repository.save(user);
        cloudinaryService.deleteFile(oldCvdUrl);
        return ApiResponse.ok("Cv Yüklendi");
    }
    protected User findById(String id){
        return repository.findById(id).orElseThrow(()->new NotFoundException("Kullanıcı"));
    }

    protected User findByUserName(String username){
        return repository.findByUsername(username).orElseThrow(()->new NotFoundException("Kullanıcı"));
    }

    public ApiResponse<Void> addSkill(AddSkillRequest request) {
        User user=manager.getAuthenticatedUser();
        user.setSkills(request.getSkills());
        repository.save(user);
        return ApiResponse.ok("Yetenekler eklendi");
    }

    public ApiResponse<Void> addContactAddresses(AddContactAddressesRequest request) {
        User user=manager.getAuthenticatedUser();
        user.setContactAddresses(request.getContactAddresses());
        repository.save(user);
        return ApiResponse.ok("İletişim adresleri eklendi");
    }

    public ApiResponse<UserDto> getUserByUsername(String username) {
        User user=findByUserName(username);
        return ApiResponse.ok("Kullanici Bilgisi",converter.convertUser(user));
    }
    public ApiResponse<UserDto> getUserById(String id) {
        User user=findById(id);
        return ApiResponse.ok("Kullanici Bilgisi",converter.convertUser(user));
    }

    public ApiResponse<List<UserDto>> getUsers() {
        List<User> users=repository.findAll();
        List<UserDto> data=users.stream().map(converter::convertUser).toList();
        return ApiResponse.ok("Kullanici Listesi",data);
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return findByUserName(username);
    }

    public ApiResponse<List<UserInformation>> searchUser(String username) {
      List<User> users=repository.findUsersByUsername(username);
      return ApiResponse.ok("Kullanıcılar",users.stream().map(converter::convertUserInformation).collect(Collectors.toList()));
    }

    public ApiResponse<UserDto> getCurrentUser() {
        User user = manager.getAuthenticatedUser();
        return ApiResponse.ok("Mevcut Kullanıcı", converter.convertUser(user));
    }
}
