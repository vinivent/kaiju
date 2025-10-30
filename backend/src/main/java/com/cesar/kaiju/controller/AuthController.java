package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.LoginRequestDTO;
import com.cesar.kaiju.dto.ResetPasswordRequestDTO;
import com.cesar.kaiju.dto.UserRegisterRequestDTO;
import com.cesar.kaiju.service.UserService;
import com.cesar.kaiju.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO request) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                request.username(), request.password());
        authenticationManager.authenticate(authentication);
        String token = jwtUtil.generateToken(request.username());

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();


        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body("Login realizado com sucesso.");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Sessão Encerrada.");
    }

    @GetMapping("/auth/session")
    public ResponseEntity<?> validateSession(
            @CookieValue(name = "token", required = false) String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String username = jwtUtil.extractUsername(token);
            boolean valid = jwtUtil.validateToken(token, username);
            if (!valid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            return ResponseEntity.ok()
                    .cacheControl(CacheControl.noStore())
                    .header(HttpHeaders.PRAGMA, "no-cache")
                    .build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegisterRequestDTO request) {
        userService.createUser(request);
        return ResponseEntity.ok("Usuário registrado com sucesso. Verifique seu e-mail.");
    }

    @GetMapping("/verify/{uuid}")
    public ResponseEntity<String> verify(@PathVariable("uuid") String token) {
        try {
            String result = userService.verifyUser(token);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao verificar usuário.");
        }
    }


    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestBody String email) {
        try {
            userService.resendVerificationEmail(email);
            return ResponseEntity.ok("Link de verificação reenviado.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao reenviar verificação.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {
        try {
            userService.sendResetPasswordEmail(email);
            return ResponseEntity.ok("Instruções de redefinição de senha enviadas.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar redefinição de senha.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequestDTO request) {
        try {
            userService.resetPassword(request.token(), request.newPassword());
            return ResponseEntity.ok("Senha redefinida com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao redefinir senha.");
        }
    }

    @GetMapping("/reset-password/validate")
    public ResponseEntity<String> validateResetToken(@RequestParam String token) {
        try {
            boolean valid = userService.validateResetToken(token);
            return valid
                    ? ResponseEntity.ok("Token válido.")
                    : ResponseEntity.status(HttpStatus.GONE).body("Token expirado ou inválido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao validar token.");
        }
    }
}
