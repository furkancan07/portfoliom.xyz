package com.rf.portfolioM.service;

import com.rf.portfolioM.dto.AddExperienceRequest;
import com.rf.portfolioM.dto.ExperienceDto;
import com.rf.portfolioM.dto.UpdateExperienceRequest;
import com.rf.portfolioM.dto.converter.DtoConverter;
import com.rf.portfolioM.exception.NotFoundException;
import com.rf.portfolioM.model.Experience;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.repository.ExperienceRepository;
import com.rf.portfolioM.repository.UserRepository;
import com.rf.portfolioM.security.UserIdentityManager;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ExperienceService {
    private final ExperienceRepository repository;
    private final UserIdentityManager manager;
    private final DtoConverter converter;
    private final UserRepository userRepository;

  @Transactional
    public List<Experience> saveExperiences(List<AddExperienceRequest> experiences){

        if (experiences == null || experiences.isEmpty()) {
            return List.of();
        }
        List<Experience> experiencesList=experiences.stream().map(this::convertExperience).toList();
        deleteAllByUser();
        repository.saveAll(experiencesList);

        return experiencesList;


    }
    @Transactional
    public void deleteAllByUser(){
        User user=manager.getAuthenticatedUser();
        repository.deleteAllByUser(user);
    }

    private Experience convertExperience(AddExperienceRequest request){
        User user=manager.getAuthenticatedUser();
        return Experience.builder().companyName(request.getCompanyName()).position(request.getPosition()).startTime(request.getStartTime())
                .endDate(request.getEndDate()).user(user).build();
    }


    public ApiResponse<List<ExperienceDto>> list(String username) {
        User user=userRepository.findByUsername(username).orElseThrow(()-> new NotFoundException("Kullanici"));
        List<Experience> experiences=repository.findByUserOrderByEndDateDesc(user);
        return ApiResponse.ok("Deneyim Bilgisi",experiences.stream().map(converter::convertExperience).collect(Collectors.toList()));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.ok("Deneyim silindi");
    }
    public ApiResponse<ExperienceDto> updateExperience(UpdateExperienceRequest request, String id){
        Experience experience=findById(id);
        experience.setCompanyName(request.getCompanyName());
        experience.setPosition(request.getPosition());
        experience.setEndDate(request.getEndDate());
        experience.setStartTime(request.getStartTime());
        repository.save(experience);
        return ApiResponse.ok("Deneyim güncellendi",converter.convertExperience(experience));
    }
    protected Experience findById(String id){
        return repository.findById(id).orElseThrow(()->new NotFoundException("Deneyim "));
    }
}
