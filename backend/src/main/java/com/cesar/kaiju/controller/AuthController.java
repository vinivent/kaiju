package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.LoginRequestDTO;
import com.cesar.kaiju.dto.LoginResponseDTO;
import com.cesar.kaiju.dto.ResetPasswordRequestDTO;
import com.cesar.kaiju.dto.UserRegisterRequestDTO;
import com.cesar.kaiju.exception.EmailAlreadyUsedException;
import com.cesar.kaiju.exception.UsernameAlreadyUsedExcpetion;
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
    public ResponseEntity<Object> login(@RequestBody LoginRequestDTO request) {
        try {
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    request.username(), request.password());
            authenticationManager.authenticate(authentication);
            String token = jwtUtil.generateToken(request.username());

            ResponseCookie cookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .build();

            LoginResponseDTO response = new LoginResponseDTO(token, "Login realizado com sucesso.");
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciais inválidas.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Sessão Encerrada.");
    }

    @GetMapping("/session")
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
        try {
            userService.createUser(request);
            return ResponseEntity.ok("Usuário registrado com sucesso.");
        } catch (EmailAlreadyUsedException | UsernameAlreadyUsedExcpetion e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Dados inválidos. Verifique as informações fornecidas.");
        }
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
            return ResponseEntity.ok("Se o email estiver cadastrado, você receberá um link de verificação.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Dados inválidos. Verifique as informações fornecidas.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar solicitação. Tente novamente mais tarde.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {
        try {
            userService.sendResetPasswordEmail(email);
            return ResponseEntity.ok("Se o email estiver cadastrado, você receberá instruções de redefinição de senha.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.ok("Se o email estiver cadastrado, você receberá instruções de redefinição de senha.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar solicitação. Tente novamente mais tarde.");
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
