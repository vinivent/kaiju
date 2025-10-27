package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.VeterinarianRequestDTO;
import com.cesar.kaiju.dto.VeterinarianResponseDTO;
import com.cesar.kaiju.enums.VeterinarianSpecialization;
import com.cesar.kaiju.service.VeterinarianService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/veterinarians")
public class VeterinarianController {

    private final VeterinarianService veterinarianService;

    public VeterinarianController(VeterinarianService veterinarianService) {
        this.veterinarianService = veterinarianService;
    }

    @PostMapping
    public ResponseEntity<VeterinarianResponseDTO> createVeterinarian(
            @Valid @RequestBody VeterinarianRequestDTO request) {
        VeterinarianResponseDTO vet = veterinarianService.createVeterinarian(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(vet);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VeterinarianResponseDTO> getVeterinarian(@PathVariable UUID id) {
        VeterinarianResponseDTO vet = veterinarianService.getVeterinarianById(id);
        return ResponseEntity.ok(vet);
    }

    @GetMapping
    public ResponseEntity<Page<VeterinarianResponseDTO>> getAllVeterinarians(
            @RequestParam(required = false) Boolean verified,
            @RequestParam(required = false) Boolean availableForChat,
            Pageable pageable) {
        Page<VeterinarianResponseDTO> vets = veterinarianService.getAllVeterinarians(verified, availableForChat, pageable);
        return ResponseEntity.ok(vets);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<VeterinarianResponseDTO>> searchVeterinarians(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<VeterinarianResponseDTO> vets = veterinarianService.searchVeterinarians(keyword, pageable);
        return ResponseEntity.ok(vets);
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<Page<VeterinarianResponseDTO>> getBySpecialization(
            @PathVariable VeterinarianSpecialization specialization,
            Pageable pageable) {
        Page<VeterinarianResponseDTO> vets = veterinarianService.getBySpecialization(specialization, pageable);
        return ResponseEntity.ok(vets);
    }

    @GetMapping("/location")
    public ResponseEntity<Page<VeterinarianResponseDTO>> getByLocation(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            Pageable pageable) {
        Page<VeterinarianResponseDTO> vets = veterinarianService.getByLocation(city, state, pageable);
        return ResponseEntity.ok(vets);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<VeterinarianResponseDTO>> getNearbyVeterinarians(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "50") Double radiusKm) {
        List<VeterinarianResponseDTO> vets = veterinarianService.getNearbyVeterinarians(latitude, longitude, radiusKm);
        return ResponseEntity.ok(vets);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<VeterinarianResponseDTO>> getTopRated(
            @RequestParam(defaultValue = "10") int limit) {
        List<VeterinarianResponseDTO> vets = veterinarianService.getTopRatedVeterinarians(limit);
        return ResponseEntity.ok(vets);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VeterinarianResponseDTO> updateVeterinarian(
            @PathVariable UUID id,
            @Valid @RequestBody VeterinarianRequestDTO request) {
        VeterinarianResponseDTO vet = veterinarianService.updateVeterinarian(id, request);
        return ResponseEntity.ok(vet);
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<Void> verifyVeterinarian(@PathVariable UUID id) {
        veterinarianService.verifyVeterinarian(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<Void> updateAvailability(
            @PathVariable UUID id,
            @RequestParam Boolean available) {
        veterinarianService.updateChatAvailability(id, available);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVeterinarian(@PathVariable UUID id) {
        veterinarianService.deleteVeterinarian(id);
        return ResponseEntity.noContent().build();
    }
}
