package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.HealthcareLocationResponseDTO;
import com.cesar.kaiju.enums.LocationType;
import com.cesar.kaiju.service.HealthcareLocationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/locations")
public class HealthcareLocationController {

    private final HealthcareLocationService locationService;

    public HealthcareLocationController(HealthcareLocationService locationService) {
        this.locationService = locationService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<HealthcareLocationResponseDTO> getLocation(@PathVariable UUID id) {
        HealthcareLocationResponseDTO location = locationService.getLocationById(id);
        return ResponseEntity.ok(location);
    }

    @GetMapping
    public ResponseEntity<Page<HealthcareLocationResponseDTO>> getAllLocations(
            @RequestParam(required = false) LocationType type,
            Pageable pageable) {
        Page<HealthcareLocationResponseDTO> locations = locationService.getAllLocations(type, pageable);
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<HealthcareLocationResponseDTO>> searchLocations(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) LocationType type,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Boolean emergencyService,
            @RequestParam(required = false) Boolean hours24,
            @RequestParam(required = false) Boolean acceptsInsurance,
            Pageable pageable) {
        Page<HealthcareLocationResponseDTO> locations = locationService.searchLocations(
                query, type, city, state, emergencyService, hours24, acceptsInsurance, pageable);
        return ResponseEntity.ok(locations);
    }

}
