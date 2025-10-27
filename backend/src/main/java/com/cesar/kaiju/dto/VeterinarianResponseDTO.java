package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.VeterinarianSpecialization;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public record VeterinarianResponseDTO(
        UUID veterinarianId,
        UUID userId,
        String fullName,
        String licenseNumber,
        List<VeterinarianSpecialization> specializations,
        String bio,
        String contactEmail,
        String phoneNumber,
        String clinicName,
        String clinicAddress,
        String city,
        String state,
        String zipCode,
        String country,
        Double latitude,
        Double longitude,
        Integer yearsOfExperience,
        List<String> certifications,
        List<String> languagesSpoken,
        String profilePicture,
        Boolean isVerified,
        Boolean isAvailableForChat,
        Double rating,
        Integer reviewCount,
        Boolean acceptsNewPatients,
        Date createdAt,
        Date updatedAt
) {}
