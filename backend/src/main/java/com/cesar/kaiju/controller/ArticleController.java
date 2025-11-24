package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.ArticleResponseDTO;
import com.cesar.kaiju.enums.ArticleCategory;
import com.cesar.kaiju.enums.ArticleStatus;
import com.cesar.kaiju.service.ArticleService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponseDTO> getArticle(@PathVariable UUID id) {
        ArticleResponseDTO article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ArticleResponseDTO> getArticleBySlug(@PathVariable String slug) {
        ArticleResponseDTO article = articleService.getArticleBySlug(slug);
        return ResponseEntity.ok(article);
    }

    @GetMapping
    public ResponseEntity<Page<ArticleResponseDTO>> getAllArticles(
            @RequestParam(required = false) ArticleStatus status,
            @RequestParam(required = false) ArticleCategory category,
            @RequestParam(required = false) Boolean featured,
            Pageable pageable) {
        Page<ArticleResponseDTO> articles = articleService.getAllArticles(status, category, featured, pageable);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ArticleResponseDTO>> searchArticles(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) ArticleCategory category,
            @RequestParam(required = false) UUID authorId,
            @RequestParam(required = false) ArticleStatus status,
            Pageable pageable) {
        Page<ArticleResponseDTO> articles = articleService.searchArticles(query, category, authorId, status, pageable);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<Page<ArticleResponseDTO>> getArticlesByTag(
            @PathVariable String tag,
            Pageable pageable) {
        Page<ArticleResponseDTO> articles = articleService.getArticlesByTag(tag, pageable);
        return ResponseEntity.ok(articles);
    }

}
