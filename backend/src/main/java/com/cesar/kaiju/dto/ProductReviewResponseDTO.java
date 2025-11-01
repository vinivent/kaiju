package com.cesar.kaiju.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;
import java.util.UUID;

public record ProductReviewResponseDTO(
        Long id,
        UUID productId,
        UUID userId,
        String userName,
        Integer rating,
        String comment,
        Integer helpful,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
        Date createdAt
) {}

