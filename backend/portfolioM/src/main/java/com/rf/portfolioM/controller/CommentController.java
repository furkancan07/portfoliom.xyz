package com.rf.portfolioM.controller;

import com.rf.portfolioM.dto.AddCommentRequest;
import com.rf.portfolioM.dto.CommentDto;
import com.rf.portfolioM.service.CommentService;
import com.rf.portfolioM.utils.ApiPaths;
import com.rf.portfolioM.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiPaths.COMMENT)
public class CommentController {
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
    ResponseEntity<ApiResponse<Void>> addComment(@PathVariable String userId,@PathVariable String projectId, @RequestBody @Valid AddCommentRequest request){
        return ResponseEntity.ok(service.addComment(userId,projectId,request));
    }
    // yorum sil
    @DeleteMapping(ApiPaths.DELETE)
    ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable String id){
        return ResponseEntity.ok(service.delete(id));
    }
    // yorum güncelle
    @PutMapping(ApiPaths.UPDATE)
    public ResponseEntity<ApiResponse<CommentDto>> updateComment(@PathVariable String id,@RequestBody @Valid AddCommentRequest request){
        return ResponseEntity.ok(service.updateComment(id,request));
    }

    // projeye ait yorumları getir
    @GetMapping(ApiPaths.GET_COMMENTS_BY_PROJECT)
    ResponseEntity<ApiResponse<List<CommentDto>>> getCommentsByProject(@PathVariable String id){
        return ResponseEntity.ok(service.getCommentsByProject(id));
    }



}
