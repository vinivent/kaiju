package com.cesar.kaiju.repository;

import com.cesar.kaiju.enums.ArticleCategory;
import com.cesar.kaiju.enums.ArticleStatus;
import com.cesar.kaiju.model.Article;
import com.cesar.kaiju.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ArticleRepository extends JpaRepository<Article, UUID> {
    
    Optional<Article> findBySlug(String slug);
    
    Page<Article> findByStatus(ArticleStatus status, Pageable pageable);
    
    Page<Article> findByCategory(ArticleCategory category, Pageable pageable);
    
    Page<Article> findByCategoryAndStatus(ArticleCategory category, ArticleStatus status, Pageable pageable);
    
    Page<Article> findByAuthor(User author, Pageable pageable);
    
    Page<Article> findByIsFeaturedAndStatus(Boolean isFeatured, ArticleStatus status, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = :status AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Article> searchArticles(@Param("keyword") String keyword, @Param("status") ArticleStatus status, Pageable pageable);
    
    @Query("SELECT a FROM Article a JOIN a.tags t WHERE LOWER(t) = LOWER(:tag) AND a.status = 'PUBLISHED'")
    Page<Article> findByTag(@Param("tag") String tag, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' ORDER BY a.viewCount DESC")
    List<Article> findMostViewed(Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' ORDER BY a.likeCount DESC")
    List<Article> findMostLiked(Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' ORDER BY a.publishedAt DESC")
    List<Article> findLatestPublished(Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' AND a.category = :category " +
           "ORDER BY a.viewCount DESC")
    List<Article> findPopularByCategory(@Param("category") ArticleCategory category, Pageable pageable);
    
    @Modifying
    @Query("DELETE FROM Article a WHERE a.author = :author")
    void deleteByAuthor(@Param("author") User author);
}
