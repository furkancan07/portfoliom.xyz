package com.rf.portfolioM.dto.converter;

import com.rf.portfolioM.dto.CommentDto;
import com.rf.portfolioM.dto.ProjectDto;
import com.rf.portfolioM.dto.UserDto;
import com.rf.portfolioM.dto.UserInformation;
import com.rf.portfolioM.model.Comment;
import com.rf.portfolioM.model.Project;
import com.rf.portfolioM.model.User;
import org.springframework.stereotype.Component;

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
    public ProjectDto convertProject(Project project) {
    return  ProjectDto.builder().id(project.getId()).name(project.getName()).description(project.getDescription())
                .imagesUrl(project.getImagesUrl()).projectArea(project.getProjectArea())
                .skills(project.getSkills())
                .user(convertUserInformation(project.getUser())).projectLink(project.getProjectLink())
                .build();

    }
    public CommentDto convertComment(Comment comment){
        return CommentDto.builder().id(comment.getId()).comment(comment.getComment())
                .project(convertProject(comment.getProject())).user(convertUserInformation(comment.getUser()))
                .build();
    }


}
