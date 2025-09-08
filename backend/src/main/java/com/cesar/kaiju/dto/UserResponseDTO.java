package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.UserSituation;

import java.util.Date;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String username,
        String email,
        String name,
        UserSituation situation,
        String avatar,
        Date createdAt
) {}
