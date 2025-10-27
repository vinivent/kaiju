package com.cesar.kaiju.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record StartConversationRequestDTO(
        @NotNull UUID veterinarianId,
        String subject,
        String initialMessage
) {}
