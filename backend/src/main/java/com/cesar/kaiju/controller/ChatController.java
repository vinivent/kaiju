package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.ChatConversationResponseDTO;
import com.cesar.kaiju.dto.ChatMessageRequestDTO;
import com.cesar.kaiju.dto.ChatMessageResponseDTO;
import com.cesar.kaiju.dto.StartConversationRequestDTO;
import com.cesar.kaiju.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/conversations")
    public ResponseEntity<ChatConversationResponseDTO> startConversation(
            @Valid @RequestBody StartConversationRequestDTO request) {
        ChatConversationResponseDTO conversation = chatService.startConversation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(conversation);
    }

    @GetMapping("/conversations")
    public ResponseEntity<Page<ChatConversationResponseDTO>> getMyConversations(
            Pageable pageable) {
        Page<ChatConversationResponseDTO> conversations = chatService.getUserConversations(pageable);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<ChatConversationResponseDTO> getConversation(
            @PathVariable UUID conversationId) {
        ChatConversationResponseDTO conversation = chatService.getConversationById(conversationId);
        return ResponseEntity.ok(conversation);
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ChatMessageResponseDTO> sendMessage(
            @PathVariable UUID conversationId,
            @Valid @RequestBody ChatMessageRequestDTO request) {
        ChatMessageResponseDTO message = chatService.sendMessage(conversationId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Page<ChatMessageResponseDTO>> getMessages(
            @PathVariable UUID conversationId,
            Pageable pageable) {
        Page<ChatMessageResponseDTO> messages = chatService.getConversationMessages(conversationId, pageable);
        return ResponseEntity.ok(messages);
    }

    @PatchMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID conversationId) {
        chatService.markConversationAsRead(conversationId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/conversations/{conversationId}/close")
    public ResponseEntity<Void> closeConversation(@PathVariable UUID conversationId) {
        chatService.closeConversation(conversationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        Long count = chatService.getUnreadConversationsCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID messageId) {
        chatService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }
}
