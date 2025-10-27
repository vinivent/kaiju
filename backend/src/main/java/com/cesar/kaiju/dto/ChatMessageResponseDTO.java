package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.MessageType;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public record ChatMessageResponseDTO(
        UUID messageId,
        UUID conversationId,
        UUID senderId,
        String senderName,
        String content,
        MessageType messageType,
        List<String> attachments,
        Boolean isRead,
        Date readAt,
        Boolean isEdited,
        Date editedAt,
        Date sentAt
) {}
