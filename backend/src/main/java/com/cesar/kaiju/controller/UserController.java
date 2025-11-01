package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.UserResponseDTO;
import com.cesar.kaiju.dto.UserUpdateRequestDTO;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Controller
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        try {

            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponseDTO userResponse = new UserResponseDTO(
                    user.getUserId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getName(),
                    user.getSituation(),
                    user.getAvatar(),
                    user.getCreatedAt()
            );
            return ResponseEntity.ok(userResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editUser(UUID id, UserUpdateRequestDTO request) {
        try {
            userService.updateUser(id, request);
            return ResponseEntity.ok("Usuário atualizado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao atualizar usuário.");
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(UUID id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Usuário excluído com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao excluir usuário.");
        }
    }
}
