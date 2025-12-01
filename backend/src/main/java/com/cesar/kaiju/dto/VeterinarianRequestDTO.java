package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.VeterinarianSpecialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record VeterinarianRequestDTO(
        @NotBlank String fullName,
        @NotBlank String licenseNumber,
        @NotNull List<VeterinarianSpecialization> specializations,
        String bio,
        @Email @NotBlank String contactEmail,
        String phoneNumber,
        String clinicName,
        String clinicAddress,
        @NotBlank String city,
        @NotBlank String state,
        String zipCode,
        @NotBlank String country,
        Double latitude,
        Double longitude,
        Integer yearsOfExperience,
        List<String> certifications,
        List<String> languagesSpoken,
        String profilePicture,
        Boolean isAvailableForChat,
        Boolean acceptsNewPatients,
        Double consultationFee
) {}
