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
            @RequestParam(required = false) String query,
            @RequestParam(required = false) VeterinarianSpecialization specialty,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Boolean onlineConsultation,
            Pageable pageable) {
        Page<VeterinarianResponseDTO> vets = veterinarianService.searchVeterinarians(
                query, specialty, city, state, minExperience, onlineConsultation, pageable);
        return ResponseEntity.ok(vets);
    }

}
