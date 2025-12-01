package com.cesar.kaiju.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.authentication.BadCredentialsException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handlerBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Credenciais inválidas. Tente novamente.");
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<String> handleEmailAlreadyUsed(EmailAlreadyUsedException e) {
        // Generic message - don't reveal that email is already used
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Dados inválidos. Verifique as informações fornecidas.");
    }

    @ExceptionHandler(UsernameAlreadyUsedExcpetion.class)
    public ResponseEntity<String> handleUsernameAlreadyUsed(UsernameAlreadyUsedExcpetion e) {
        // Generic message - don't reveal that username is already used
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Dados inválidos. Verifique as informações fornecidas.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Ocorreu um erro inesperado.");
    }
}