package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.ArticleCategory;
import com.cesar.kaiju.enums.ArticleStatus;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public record ArticleResponseDTO(
        UUID articleId,
        String title,
        String summary,
        String content,
        ArticleCategory category,
        ArticleStatus status,
        UUID authorId,
        String authorName,
        String featuredImage,
        List<String> images,
        List<String> tags,
        String slug,
        Integer viewCount,
        Integer likeCount,
        Integer shareCount,
        Boolean isFeatured,
        Boolean allowComments,
        Date publishedAt,
        Date createdAt,
        Date updatedAt
) {}
