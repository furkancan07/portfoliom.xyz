package com.rf.portfolioM.dto.converter;

import com.rf.portfolioM.dto.*;
import com.rf.portfolioM.model.Comment;
import com.rf.portfolioM.model.Experience;
import com.rf.portfolioM.model.Project;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.repository.ExperienceRepository;
import com.rf.portfolioM.security.UserIdentityManager;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DtoConverter {


    public UserInformation convertUserInformation(User user){
        return UserInformation.builder().id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .surname(user.getSurname())
                .role(user.getRole())
                .profilePhotoUrl(user.getProfilePhotoUrl()).build();
    }

    public UserDto convertUser(User user){
       return UserDto.builder()
                .id(user.getId())
               .username(user.getUsername())
               .name(user.getName())
               .surname(user.getSurname())
               .university(user.getUniversity())
               .job(user.getJob())
               .area(user.getArea())
               .email(user.getEmail())
               .profilePhotoUrl(user.getProfilePhotoUrl())
               .cvUrl(user.getCvUrl())
               .aboutMe(user.getAboutMe())
               .skills(user.getSkills())
               .role(user.getRole())
               .contactAddresses(user.getContactAddresses())

               .build();
    }
    public ProjectDto convertProject(Project from) {
        if(from == null) {
            return null;
        }
        
        return ProjectDto.builder()
                .id(from.getId())
                .name(from.getName())
                .description(from.getDescription())
                .imagesUrl(from.getImagesUrl() != null ? new ArrayList<>(from.getImagesUrl()) : new ArrayList<>())
                .projectArea(from.getProjectArea())
                .skills(from.getSkills() != null ? new ArrayList<>(from.getSkills()) : new ArrayList<>())
                .user(convertUserInformation(from.getUser()))
                .projectLink(from.getProjectLink())
                .build();
    }
    public CommentDto convertComment(Comment comment){
        return CommentDto.builder().id(comment.getId()).comment(comment.getComment())
                .project(convertProject(comment.getProject())).user(convertUserInformation(comment.getUser()))
                .build();
    }
    public ExperienceDto convertExperience(Experience experience){
        return ExperienceDto.builder().companyName(experience.getCompanyName())
                .startTime(experience.getStartTime())
                .endDate(experience.getEndDate())
                .position(experience.getPosition())
                .user(convertUserInformation(experience.getUser()))
                .id(experience.getId())
                .build();
    }


}
