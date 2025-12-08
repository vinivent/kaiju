package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.UserResponseDTO;
import com.cesar.kaiju.dto.UserUpdateRequestDTO;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
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
                    user.getRole(),
                    user.getSituation(),
                    user.getAvatar(),
                    user.getHeader(),
                    user.getDescription(),
                    user.getCreatedAt()
            );
            return ResponseEntity.ok(userResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable String id) {
        try {
            UUID userId;
            try {
                userId = UUID.fromString(id);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            
            User user = userService.getUserById(userId);
            UserResponseDTO userResponse = new UserResponseDTO(
                    user.getUserId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole(),
                    user.getSituation(),
                    user.getAvatar(),
                    user.getHeader(),
                    user.getDescription(),
                    user.getCreatedAt()
            );
            return ResponseEntity.ok(userResponse);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editUser(@PathVariable UUID id, @RequestBody UserUpdateRequestDTO request) {
        try {
            userService.updateUser(id, request);
            return ResponseEntity.ok("Usuário atualizado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao atualizar usuário.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        try {
            userService.deleteUser(id);
            
            // Clear the token cookie
            ResponseCookie cookie = ResponseCookie.from("token", "")
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(0)
                    .build();
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body("Usuário excluído com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao excluir usuário.");
        }
    }

    @PostMapping("/become-veterinarian")
    public ResponseEntity<String> becomeVeterinarian() {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            userService.becomeVeterinarian(user.getUserId());
            return ResponseEntity.ok("Role atualizado para VETERINARIAN com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao atualizar role.");
        }
    }

    @PostMapping("/become-seller")
    public ResponseEntity<String> becomeSeller() {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            userService.becomeSeller(user.getUserId());
            return ResponseEntity.ok("Role atualizado para SELLER com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao atualizar role.");
        }
    }
}
