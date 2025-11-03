package com.cesar.kaiju.repository;

import com.cesar.kaiju.enums.ConversationStatus;
import com.cesar.kaiju.model.ChatConversation;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.model.Veterinarian;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, UUID> {
    
    Page<ChatConversation> findByUser(User user, Pageable pageable);
    
    Page<ChatConversation> findByVeterinarian(Veterinarian veterinarian, Pageable pageable);
    
    Page<ChatConversation> findByUserAndStatus(User user, ConversationStatus status, Pageable pageable);
    
    Page<ChatConversation> findByVeterinarianAndStatus(Veterinarian veterinarian, ConversationStatus status, Pageable pageable);
    
    @Query("SELECT c FROM ChatConversation c WHERE c.user = :user AND c.veterinarian = :vet AND c.status = 'ACTIVE'")
    Optional<ChatConversation> findActiveConversation(@Param("user") User user, @Param("vet") Veterinarian veterinarian);
    
    @Query("SELECT c FROM ChatConversation c WHERE c.user = :user ORDER BY c.lastMessageAt DESC")
    List<ChatConversation> findRecentByUser(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT c FROM ChatConversation c WHERE c.veterinarian = :vet ORDER BY c.lastMessageAt DESC")
    List<ChatConversation> findRecentByVeterinarian(@Param("vet") Veterinarian veterinarian, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM ChatConversation c WHERE c.user = :user AND c.userUnreadCount = true")
    Long countUnreadByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(c) FROM ChatConversation c WHERE c.veterinarian = :vet AND c.vetUnreadCount = true")
    Long countUnreadByVeterinarian(@Param("vet") Veterinarian veterinarian);
    
    @Modifying
    @Query("DELETE FROM ChatConversation c WHERE c.user = :user")
    void deleteByUser(@Param("user") User user);
}
