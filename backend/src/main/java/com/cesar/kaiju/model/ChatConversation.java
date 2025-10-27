package com.cesar.kaiju.model;

import com.cesar.kaiju.enums.ConversationStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "chat_conversations")
@Getter
@Setter
public class ChatConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID conversationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinarian_id", nullable = false)
    private Veterinarian veterinarian;

    @Column(length = 300)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConversationStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    private Date lastMessageAt;

    @Column(nullable = false)
    private Boolean userUnreadCount;

    @Column(nullable = false)
    private Boolean vetUnreadCount;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    @Column(nullable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    private Date closedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        lastMessageAt = new Date();
        if (userUnreadCount == null) userUnreadCount = false;
        if (vetUnreadCount == null) vetUnreadCount = false;
        if (status == null) status = ConversationStatus.ACTIVE;
    }
}
