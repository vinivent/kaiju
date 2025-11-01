package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.ArticleRequestDTO;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping
    public ResponseEntity<ArticleResponseDTO> createArticle(
            @Valid @RequestBody ArticleRequestDTO request) {
        ArticleResponseDTO article = articleService.createArticle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(article);
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

    @GetMapping("/author/{authorId}")
    public ResponseEntity<Page<ArticleResponseDTO>> getArticlesByAuthor(
            @PathVariable UUID authorId,
            Pageable pageable) {
        Page<ArticleResponseDTO> articles = articleService.getArticlesByAuthor(authorId, pageable);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<ArticleResponseDTO>> getMostViewed(
            @RequestParam(defaultValue = "10") int limit) {
        List<ArticleResponseDTO> articles = articleService.getMostViewedArticles(limit);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/liked")
    public ResponseEntity<List<ArticleResponseDTO>> getMostLiked(
            @RequestParam(defaultValue = "10") int limit) {
        List<ArticleResponseDTO> articles = articleService.getMostLikedArticles(limit);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<ArticleResponseDTO>> getLatest(
            @RequestParam(defaultValue = "10") int limit) {
        List<ArticleResponseDTO> articles = articleService.getLatestArticles(limit);
        return ResponseEntity.ok(articles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponseDTO> updateArticle(
            @PathVariable UUID id,
            @Valid @RequestBody ArticleRequestDTO request) {
        ArticleResponseDTO article = articleService.updateArticle(id, request);
        return ResponseEntity.ok(article);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable UUID id,
            @RequestParam ArticleStatus status) {
        articleService.updateArticleStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable UUID id) {
        articleService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/like")
    public ResponseEntity<Void> incrementLikeCount(@PathVariable UUID id) {
        articleService.incrementLikeCount(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable UUID id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
