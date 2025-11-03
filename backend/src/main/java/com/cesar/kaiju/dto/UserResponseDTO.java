package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.UserRole;
import com.cesar.kaiju.enums.UserSituation;

import java.util.Date;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String username,
        String email,
        String name,
        UserRole role,
        UserSituation situation,
        String avatar,
        String header,
        String description,
        Date createdAt
) {}
