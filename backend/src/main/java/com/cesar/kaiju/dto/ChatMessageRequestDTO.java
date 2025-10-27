package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.MessageType;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ChatMessageRequestDTO(
        @NotBlank String content,
        MessageType messageType,
        List<String> attachments
) {}
