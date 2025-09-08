package com.cesar.kaiju.dto;

public record UserUpdateRequestDTO(
        String username,
        String name,
        String description,
        String avatar,
        String password
) {}
