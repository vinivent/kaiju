package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.ArticleCategory;
import com.cesar.kaiju.enums.ArticleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ArticleRequestDTO(
        @NotBlank String title,
        String summary,
        @NotBlank String content,
        @NotNull ArticleCategory category,
        @NotNull ArticleStatus status,
        String featuredImage,
        List<String> images,
        List<String> tags,
        Boolean isFeatured,
        Boolean allowComments
) {}
