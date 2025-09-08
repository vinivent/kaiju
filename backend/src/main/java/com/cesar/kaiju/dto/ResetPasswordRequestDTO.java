package com.cesar.kaiju.dto;

public record ResetPasswordRequestDTO(
        String token,
        String newPassword
) {}
