package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.ProductCategory;
import com.cesar.kaiju.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public record ProductResponseDTO(
        UUID productId,
        String name,
        String description,
        BigDecimal price,
        ProductCategory category,
        ProductStatus status,
        List<String> images,
        Integer stockQuantity,
        UUID sellerId,
        String sellerName,
        String brand,
        String manufacturer,
        List<String> tags,
        Double rating,
        Integer reviewCount,
        Date createdAt,
        Date updatedAt
) {}
