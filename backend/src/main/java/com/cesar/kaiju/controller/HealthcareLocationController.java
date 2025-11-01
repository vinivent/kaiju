package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.HealthcareLocationRequestDTO;
import com.cesar.kaiju.dto.HealthcareLocationResponseDTO;
import com.cesar.kaiju.enums.LocationType;
import com.cesar.kaiju.service.HealthcareLocationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/locations")
public class HealthcareLocationController {

    private final HealthcareLocationService locationService;

    public HealthcareLocationController(HealthcareLocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping
    public ResponseEntity<HealthcareLocationResponseDTO> createLocation(
            @Valid @RequestBody HealthcareLocationRequestDTO request) {
        HealthcareLocationResponseDTO location = locationService.createLocation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(location);
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

    @GetMapping("/location")
    public ResponseEntity<Page<HealthcareLocationResponseDTO>> getByLocation(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            Pageable pageable) {
        Page<HealthcareLocationResponseDTO> locations = locationService.getByLocation(city, state, pageable);
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<HealthcareLocationResponseDTO>> getNearbyLocations(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "50") Double radiusKm) {
        List<HealthcareLocationResponseDTO> locations = locationService.getNearbyLocations(latitude, longitude, radiusKm);
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/emergency")
    public ResponseEntity<List<HealthcareLocationResponseDTO>> getEmergencyLocations() {
        List<HealthcareLocationResponseDTO> locations = locationService.getEmergencyLocations();
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<HealthcareLocationResponseDTO>> getTopRated(
            @RequestParam(defaultValue = "10") int limit) {
        List<HealthcareLocationResponseDTO> locations = locationService.getTopRatedLocations(limit);
        return ResponseEntity.ok(locations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthcareLocationResponseDTO> updateLocation(
            @PathVariable UUID id,
            @Valid @RequestBody HealthcareLocationRequestDTO request) {
        HealthcareLocationResponseDTO location = locationService.updateLocation(id, request);
        return ResponseEntity.ok(location);
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<Void> verifyLocation(@PathVariable UUID id) {
        locationService.verifyLocation(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<Void> updateActiveStatus(
            @PathVariable UUID id,
            @RequestParam Boolean active) {
        locationService.updateActiveStatus(id, active);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable UUID id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}
