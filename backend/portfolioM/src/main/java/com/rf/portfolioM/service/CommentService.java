package com.rf.portfolioM.service;

import com.rf.portfolioM.dto.AddCommentRequest;
import com.rf.portfolioM.dto.CommentDto;
import com.rf.portfolioM.dto.converter.DtoConverter;
import com.rf.portfolioM.exception.NotFoundException;
import com.rf.portfolioM.model.Comment;
import com.rf.portfolioM.model.Project;
import com.rf.portfolioM.model.User;
import com.rf.portfolioM.repository.CommentRepository;
import com.rf.portfolioM.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository repository;
    private final UserService userService;
    private final ProjectService projectService;
    private final DtoConverter converter;
    public ApiResponse<Void> addComment(String userId, String projectId, AddCommentRequest request) {
        User user=userService.findById(userId);
        Project project=projectService.findById(projectId);
        Comment comment=Comment.builder().comment(request.getComment()).project(project).user(user)
                .build();
        repository.save(comment);
        return ApiResponse.ok("Yorum Eklendi");
    }
    public ApiResponse<Void> delete(String id){
        repository.deleteById(id);
        return ApiResponse.ok("Yorum Silindi");
    }
    public ApiResponse<List<CommentDto>> getCommentsByProject(String projectId){
        List<Comment> comments=repository.findByProjectId(projectId);
        return ApiResponse.ok("Yorumlar",comments.stream().map(converter::convertComment).collect(Collectors.toList()));
    }

    public ApiResponse<CommentDto> updateComment(String id, AddCommentRequest request) {
        Comment comment=findById(id);
        comment.setComment(request.getComment());
        repository.save(comment);
        return ApiResponse.ok("Yorum Güncellendi",converter.convertComment(comment));
    }

    private Comment findById(String id) {
        return repository.findById(id).orElseThrow(()->new NotFoundException("Yorum "));
    }

}
