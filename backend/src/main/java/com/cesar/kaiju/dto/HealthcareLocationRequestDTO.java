package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.LocationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record HealthcareLocationRequestDTO(
        @NotBlank String name,
        @NotNull LocationType locationType,
        String description,
        @NotBlank String address,
        @NotBlank String city,
        @NotBlank String state,
        String zipCode,
        @NotBlank String country,
        @NotNull Double latitude,
        @NotNull Double longitude,
        String phoneNumber,
        @Email String email,
        String website,
        List<String> servicesOffered,
        String operatingHours,
        @NotNull Boolean acceptsEmergencies,
        @NotNull Boolean requiresAppointment,
        List<String> images
) {}
