package com.cesar.kaiju.service;

import com.cesar.kaiju.dto.ArticleRequestDTO;
import com.cesar.kaiju.dto.ArticleResponseDTO;
import com.cesar.kaiju.enums.ArticleCategory;
import com.cesar.kaiju.enums.ArticleStatus;
import com.cesar.kaiju.model.Article;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.repository.ArticleRepository;
import com.cesar.kaiju.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public ArticleService(ArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    public ArticleResponseDTO createArticle(ArticleRequestDTO request) {
        User currentUser = getCurrentUser();
        
        Article article = new Article();
        article.setTitle(request.title());
        article.setSummary(request.summary());
        article.setContent(request.content());
        article.setCategory(request.category());
        article.setStatus(request.status());
        article.setAuthor(currentUser);
        article.setFeaturedImage(request.featuredImage());
        article.setImages(request.images());
        article.setTags(request.tags());
        article.setIsFeatured(request.isFeatured() != null ? request.isFeatured() : false);
        article.setAllowComments(request.allowComments() != null ? request.allowComments() : true);
        
        // Generate unique slug
        String slug = generateUniqueSlug(request.title());
        article.setSlug(slug);
        
        Article savedArticle = articleRepository.save(article);
        return toResponseDTO(savedArticle);
    }

    @Transactional(readOnly = true)
    public ArticleResponseDTO getArticleById(UUID id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with id: " + id));
        return toResponseDTO(article);
    }

    @Transactional(readOnly = true)
    public ArticleResponseDTO getArticleBySlug(String slug) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with slug: " + slug));
        
        // Increment view count when article is accessed by slug
        article.setViewCount(article.getViewCount() + 1);
        articleRepository.save(article);
        
        return toResponseDTO(article);
    }

    @Transactional(readOnly = true)
    public Page<ArticleResponseDTO> getAllArticles(ArticleStatus status, ArticleCategory category, Boolean featured, Pageable pageable) {
        Page<Article> articles;
        
        if (category != null && status != null) {
            articles = articleRepository.findByCategoryAndStatus(category, status, pageable);
        } else if (category != null) {
            articles = articleRepository.findByCategory(category, pageable);
        } else if (status != null) {
            articles = articleRepository.findByStatus(status, pageable);
        } else if (featured != null && status != null) {
            articles = articleRepository.findByIsFeaturedAndStatus(featured, status, pageable);
        } else {
            articles = articleRepository.findAll(pageable);
        }
        
        return articles.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ArticleResponseDTO> searchArticles(String keyword, Pageable pageable) {
        Page<Article> articles = articleRepository.searchArticles(keyword, ArticleStatus.PUBLISHED, pageable);
        return articles.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ArticleResponseDTO> getArticlesByTag(String tag, Pageable pageable) {
        Page<Article> articles = articleRepository.findByTag(tag, pageable);
        return articles.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ArticleResponseDTO> getArticlesByAuthor(UUID authorId, Pageable pageable) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + authorId));
        Page<Article> articles = articleRepository.findByAuthor(author, pageable);
        return articles.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<ArticleResponseDTO> getMostViewedArticles(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Article> articles = articleRepository.findMostViewed(pageable);
        return articles.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ArticleResponseDTO> getMostLikedArticles(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Article> articles = articleRepository.findMostLiked(pageable);
        return articles.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ArticleResponseDTO> getLatestArticles(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Article> articles = articleRepository.findLatestPublished(pageable);
        return articles.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ArticleResponseDTO updateArticle(UUID id, ArticleRequestDTO request) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!article.getAuthor().getUserId().equals(currentUser.getUserId())) {
            throw new SecurityException("You can only update your own articles");
        }
        
        article.setTitle(request.title());
        article.setSummary(request.summary());
        article.setContent(request.content());
        article.setCategory(request.category());
        article.setStatus(request.status());
        article.setFeaturedImage(request.featuredImage());
        article.setImages(request.images());
        article.setTags(request.tags());
        article.setIsFeatured(request.isFeatured() != null ? request.isFeatured() : article.getIsFeatured());
        article.setAllowComments(request.allowComments() != null ? request.allowComments() : article.getAllowComments());
        
        // Regenerate slug if title changed
        if (!article.getTitle().equals(request.title())) {
            String newSlug = generateUniqueSlug(request.title());
            article.setSlug(newSlug);
        }
        
        Article updatedArticle = articleRepository.save(article);
        return toResponseDTO(updatedArticle);
    }

    public void updateArticleStatus(UUID id, ArticleStatus status) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with id: " + id));
        article.setStatus(status);
        articleRepository.save(article);
    }

    public void incrementViewCount(UUID id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with id: " + id));
        article.setViewCount(article.getViewCount() + 1);
        articleRepository.save(article);
    }

    public void incrementLikeCount(UUID id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with id: " + id));
        article.setLikeCount(article.getLikeCount() + 1);
        articleRepository.save(article);
    }

    public void deleteArticle(UUID id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!article.getAuthor().getUserId().equals(currentUser.getUserId())) {
            throw new SecurityException("You can only delete your own articles");
        }
        
        articleRepository.delete(article);
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = makeSlug(title);
        String slug = baseSlug;
        int counter = 1;
        
        while (articleRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter;
            counter++;
        }
        
        return slug;
    }

    private String makeSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }

    private ArticleResponseDTO toResponseDTO(Article article) {
        return new ArticleResponseDTO(
                article.getArticleId(),
                article.getTitle(),
                article.getSummary(),
                article.getContent(),
                article.getCategory(),
                article.getStatus(),
                article.getAuthor().getUserId(),
                article.getAuthor().getName(),
                article.getFeaturedImage(),
                article.getImages(),
                article.getTags(),
                article.getSlug(),
                article.getViewCount(),
                article.getLikeCount(),
                article.getShareCount(),
                article.getIsFeatured(),
                article.getAllowComments(),
                article.getPublishedAt(),
                article.getCreatedAt(),
                article.getUpdatedAt()
        );
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
