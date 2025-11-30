package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.AddCommentRequest;
import com.rf.portfolioM.dto.CommentDto;
import com.rf.portfolioM.service.CommentService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiPaths.COMMENT)

public class CommentController implements com.rf.portfolioM.controller.doc.CommentControllerDoc {
    private final CommentService service;

    public CommentController(CommentService service) {
        this.service = service;
    }

    // yorum ekle
    /*
    * ilk olarak userid yi pathvariable ile alacağız
    * security işlemlerini yaptıktan sonra securitycontext ile
    */
    @PostMapping(ApiPaths.ADD_COMMENT)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> addComment(@PathVariable String projectId, @RequestBody @Valid AddCommentRequest request){
        return service.addComment(projectId,request);
    }
    // yorum sil
    @DeleteMapping(ApiPaths.DELETE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<Void> deleteComment(@PathVariable String id){
        return service.delete(id);
    }
    // yorum güncelle
    @PutMapping(ApiPaths.UPDATE)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ApiResponse<CommentDto> updateComment(@PathVariable String id,@RequestBody @Valid AddCommentRequest request){
        return service.updateComment(id,request);
    }

    // projeye ait yorumları getir
    @GetMapping(ApiPaths.GET_COMMENTS_BY_PROJECT)
    public ApiResponse<List<CommentDto>> getCommentsByProject(@PathVariable String id){
        return service.getCommentsByProject(id);
    }



}
