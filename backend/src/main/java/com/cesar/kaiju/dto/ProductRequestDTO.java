package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.ProductCategory;
import com.cesar.kaiju.enums.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequestDTO(
        @NotBlank String name,
        String description,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotNull ProductCategory category,
        @NotNull ProductStatus status,
        List<String> images,
        @NotNull Integer stockQuantity,
        String brand,
        String manufacturer,
        List<String> tags
) {}
