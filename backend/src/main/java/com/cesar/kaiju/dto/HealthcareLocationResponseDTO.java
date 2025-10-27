package com.cesar.kaiju.dto;

import com.cesar.kaiju.enums.LocationType;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public record HealthcareLocationResponseDTO(
        UUID locationId,
        String name,
        LocationType locationType,
        String description,
        String address,
        String city,
        String state,
        String zipCode,
        String country,
        Double latitude,
        Double longitude,
        String phoneNumber,
        String email,
        String website,
        List<String> servicesOffered,
        String operatingHours,
        Boolean acceptsEmergencies,
        Boolean requiresAppointment,
        List<String> images,
        Boolean isVerified,
        Double rating,
        Integer reviewCount,
        Boolean isActive,
        Date createdAt,
        Date updatedAt
) {}
