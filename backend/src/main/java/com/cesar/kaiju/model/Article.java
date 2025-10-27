package com.cesar.kaiju.model;

import com.cesar.kaiju.enums.ArticleCategory;
import com.cesar.kaiju.enums.ArticleStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "articles")
@Getter
@Setter
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID articleId;

    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    @Size(max = 300)
    private String title;

    @Column(length = 500)
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Content is required")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArticleCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArticleStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(length = 500)
    private String featuredImage;

    @ElementCollection
    @CollectionTable(name = "article_images", joinColumns = @JoinColumn(name = "article_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ElementCollection
    @CollectionTable(name = "article_tags", joinColumns = @JoinColumn(name = "article_id"))
    @Column(name = "tag")
    private List<String> tags;

    @Column(unique = true, nullable = false)
    private String slug;

    private Integer viewCount;

    private Integer likeCount;

    private Integer shareCount;

    @Column(nullable = false)
    private Boolean isFeatured;

    @Column(nullable = false)
    private Boolean allowComments;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    private Date publishedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    @Column(nullable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
        if (viewCount == null) viewCount = 0;
        if (likeCount == null) likeCount = 0;
        if (shareCount == null) shareCount = 0;
        if (isFeatured == null) isFeatured = false;
        if (allowComments == null) allowComments = true;
        if (status == ArticleStatus.PUBLISHED && publishedAt == null) {
            publishedAt = new Date();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
        if (status == ArticleStatus.PUBLISHED && publishedAt == null) {
            publishedAt = new Date();
        }
    }
}
