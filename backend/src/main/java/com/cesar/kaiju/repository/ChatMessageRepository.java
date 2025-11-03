package com.cesar.kaiju.repository;

import com.cesar.kaiju.model.ChatConversation;
import com.cesar.kaiju.model.ChatMessage;
import com.cesar.kaiju.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    
    Page<ChatMessage> findByConversation(ChatConversation conversation, Pageable pageable);
    
    @Query("SELECT m FROM ChatMessage m WHERE m.conversation = :conversation ORDER BY m.sentAt DESC")
    List<ChatMessage> findRecentMessages(@Param("conversation") ChatConversation conversation, Pageable pageable);
    
    @Query("SELECT m FROM ChatMessage m WHERE m.conversation = :conversation AND m.isRead = false AND m.sender != :currentUser")
    List<ChatMessage> findUnreadMessages(@Param("conversation") ChatConversation conversation, @Param("currentUser") User currentUser);
    
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.conversation = :conversation AND m.isRead = false AND m.sender != :currentUser")
    Long countUnreadMessages(@Param("conversation") ChatConversation conversation, @Param("currentUser") User currentUser);
    
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true, m.readAt = CURRENT_TIMESTAMP WHERE m.conversation = :conversation AND m.sender != :currentUser AND m.isRead = false")
    void markAllAsRead(@Param("conversation") ChatConversation conversation, @Param("currentUser") User currentUser);
    
    @Query("SELECT m FROM ChatMessage m WHERE m.conversation = :conversation ORDER BY m.sentAt ASC")
    List<ChatMessage> findAllByConversationOrdered(@Param("conversation") ChatConversation conversation);
    
    @Modifying
    @Query("DELETE FROM ChatMessage m WHERE m.sender = :sender")
    void deleteBySender(@Param("sender") User sender);
}
