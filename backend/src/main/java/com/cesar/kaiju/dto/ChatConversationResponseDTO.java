package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.ConversationStatus;

import java.util.Date;
import java.util.UUID;

public record ChatConversationResponseDTO(
        UUID conversationId,
        UUID userId,
        String userName,
        UUID veterinarianId,
        String veterinarianName,
        String subject,
        ConversationStatus status,
        Date lastMessageAt,
        Boolean hasUnread,
        Date createdAt,
        Date closedAt
) {}
