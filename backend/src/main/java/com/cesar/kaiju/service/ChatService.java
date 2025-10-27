package com.cesar.kaiju.service;

import com.cesar.kaiju.dto.*;
import com.cesar.kaiju.enums.ConversationStatus;
import com.cesar.kaiju.model.ChatConversation;
import com.cesar.kaiju.model.ChatMessage;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.model.Veterinarian;
import com.cesar.kaiju.repository.ChatConversationRepository;
import com.cesar.kaiju.repository.ChatMessageRepository;
import com.cesar.kaiju.repository.UserRepository;
import com.cesar.kaiju.repository.VeterinarianRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@Service
@Transactional
public class ChatService {

    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final VeterinarianRepository veterinarianRepository;

    public ChatService(ChatConversationRepository conversationRepository,
                      ChatMessageRepository messageRepository,
                      UserRepository userRepository,
                      VeterinarianRepository veterinarianRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.veterinarianRepository = veterinarianRepository;
    }

    public ChatConversationResponseDTO startConversation(StartConversationRequestDTO request) {
        User currentUser = getCurrentUser();
        
        Veterinarian veterinarian = veterinarianRepository.findById(request.veterinarianId())
                .orElseThrow(() -> new EntityNotFoundException("Veterinarian not found with id: " + request.veterinarianId()));
        
        if (!veterinarian.getIsAvailableForChat()) {
            throw new IllegalStateException("Veterinarian is not available for chat");
        }
        
        // Check if active conversation already exists
        var existingConversation = conversationRepository.findActiveConversation(currentUser, veterinarian);
        if (existingConversation.isPresent()) {
            return toConversationResponseDTO(existingConversation.get());
        }
        
        // Create new conversation
        ChatConversation conversation = new ChatConversation();
        conversation.setUser(currentUser);
        conversation.setVeterinarian(veterinarian);
        conversation.setSubject(request.subject());
        conversation.setStatus(ConversationStatus.ACTIVE);
        
        ChatConversation savedConversation = conversationRepository.save(conversation);
        
        // Send initial message if provided
        if (request.initialMessage() != null && !request.initialMessage().isBlank()) {
            ChatMessage initialMessage = new ChatMessage();
            initialMessage.setConversation(savedConversation);
            initialMessage.setSender(currentUser);
            initialMessage.setContent(request.initialMessage());
            messageRepository.save(initialMessage);
            
            savedConversation.setVetUnreadCount(true);
        }
        
        return toConversationResponseDTO(savedConversation);
    }

    @Transactional(readOnly = true)
    public Page<ChatConversationResponseDTO> getUserConversations(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<ChatConversation> conversations = conversationRepository.findByUser(currentUser, pageable);
        return conversations.map(this::toConversationResponseDTO);
    }

    @Transactional(readOnly = true)
    public ChatConversationResponseDTO getConversationById(UUID conversationId) {
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with id: " + conversationId));
        
        User currentUser = getCurrentUser();
        validateConversationAccess(conversation, currentUser);
        
        return toConversationResponseDTO(conversation);
    }

    public ChatMessageResponseDTO sendMessage(UUID conversationId, ChatMessageRequestDTO request) {
        User currentUser = getCurrentUser();
        
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with id: " + conversationId));
        
        validateConversationAccess(conversation, currentUser);
        
        if (conversation.getStatus() == ConversationStatus.CLOSED) {
            throw new IllegalStateException("Cannot send messages to a closed conversation");
        }
        
        ChatMessage message = new ChatMessage();
        message.setConversation(conversation);
        message.setSender(currentUser);
        message.setContent(request.content());
        message.setMessageType(request.messageType());
        message.setAttachments(request.attachments());
        
        ChatMessage savedMessage = messageRepository.save(message);
        
        // Update conversation
        conversation.setLastMessageAt(new Date());
        
        // Update unread counts
        boolean isUserSender = conversation.getUser().getUserId().equals(currentUser.getUserId());
        if (isUserSender) {
            conversation.setVetUnreadCount(true);
        } else {
            conversation.setUserUnreadCount(true);
        }
        
        conversationRepository.save(conversation);
        
        return toMessageResponseDTO(savedMessage);
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponseDTO> getConversationMessages(UUID conversationId, Pageable pageable) {
        User currentUser = getCurrentUser();
        
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with id: " + conversationId));
        
        validateConversationAccess(conversation, currentUser);
        
        Page<ChatMessage> messages = messageRepository.findByConversation(conversation, pageable);
        return messages.map(this::toMessageResponseDTO);
    }

    public void markConversationAsRead(UUID conversationId) {
        User currentUser = getCurrentUser();
        
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with id: " + conversationId));
        
        validateConversationAccess(conversation, currentUser);
        
        // Mark all messages as read
        messageRepository.markAllAsRead(conversation, currentUser);
        
        // Update conversation unread count
        boolean isUser = conversation.getUser().getUserId().equals(currentUser.getUserId());
        if (isUser) {
            conversation.setUserUnreadCount(false);
        } else {
            conversation.setVetUnreadCount(false);
        }
        
        conversationRepository.save(conversation);
    }

    public void closeConversation(UUID conversationId) {
        User currentUser = getCurrentUser();
        
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with id: " + conversationId));
        
        validateConversationAccess(conversation, currentUser);
        
        conversation.setStatus(ConversationStatus.CLOSED);
        conversation.setClosedAt(new Date());
        conversationRepository.save(conversation);
    }

    @Transactional(readOnly = true)
    public Long getUnreadConversationsCount() {
        User currentUser = getCurrentUser();
        return conversationRepository.countUnreadByUser(currentUser);
    }

    public void deleteMessage(UUID messageId) {
        User currentUser = getCurrentUser();
        
        ChatMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found with id: " + messageId));
        
        if (!message.getSender().getUserId().equals(currentUser.getUserId())) {
            throw new SecurityException("You can only delete your own messages");
        }
        
        messageRepository.delete(message);
    }

    private void validateConversationAccess(ChatConversation conversation, User currentUser) {
        boolean isUser = conversation.getUser().getUserId().equals(currentUser.getUserId());
        boolean isVet = conversation.getVeterinarian().getUser().getUserId().equals(currentUser.getUserId());
        
        if (!isUser && !isVet) {
            throw new SecurityException("You don't have access to this conversation");
        }
    }

    private ChatConversationResponseDTO toConversationResponseDTO(ChatConversation conversation) {
        User currentUser = getCurrentUser();
        boolean isUser = conversation.getUser().getUserId().equals(currentUser.getUserId());
        
        return new ChatConversationResponseDTO(
                conversation.getConversationId(),
                conversation.getUser().getUserId(),
                conversation.getUser().getName(),
                conversation.getVeterinarian().getVeterinarianId(),
                conversation.getVeterinarian().getFullName(),
                conversation.getSubject(),
                conversation.getStatus(),
                conversation.getLastMessageAt(),
                isUser ? conversation.getUserUnreadCount() : conversation.getVetUnreadCount(),
                conversation.getCreatedAt(),
                conversation.getClosedAt()
        );
    }

    private ChatMessageResponseDTO toMessageResponseDTO(ChatMessage message) {
        return new ChatMessageResponseDTO(
                message.getMessageId(),
                message.getConversation().getConversationId(),
                message.getSender().getUserId(),
                message.getSender().getName(),
                message.getContent(),
                message.getMessageType(),
                message.getAttachments(),
                message.getIsRead(),
                message.getReadAt(),
                message.getIsEdited(),
                message.getEditedAt(),
                message.getSentAt()
        );
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
