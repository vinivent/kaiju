package com.cesar.kaiju.dto;

import jakarta.validation.constraints.Size;

public record UserRegisterRequestDTO(
        String username,
        String email,
        @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.")
        String password,
        String name
) {}
