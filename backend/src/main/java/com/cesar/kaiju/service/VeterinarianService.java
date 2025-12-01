package com.cesar.kaiju.service;

import com.cesar.kaiju.dto.VeterinarianRequestDTO;
import com.cesar.kaiju.dto.VeterinarianResponseDTO;
import com.cesar.kaiju.enums.VeterinarianSpecialization;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.model.Veterinarian;
import com.cesar.kaiju.repository.UserRepository;
import com.cesar.kaiju.repository.VeterinarianRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class VeterinarianService {

    private final VeterinarianRepository veterinarianRepository;

    public VeterinarianService(VeterinarianRepository veterinarianRepository, UserRepository userRepository) {
        this.veterinarianRepository = veterinarianRepository;
    }

    public VeterinarianResponseDTO createVeterinarian(VeterinarianRequestDTO request) {
        User currentUser = getCurrentUser();
        
        if (veterinarianRepository.findByUser(currentUser).isPresent()) {
            throw new IllegalArgumentException("You already have a veterinarian profile. Please update your existing profile instead.");
        }
        
        if (veterinarianRepository.findByLicenseNumber(request.licenseNumber()).isPresent()) {
            throw new IllegalArgumentException("License number already registered");
        }
        
        Veterinarian veterinarian = new Veterinarian();
        veterinarian.setUser(currentUser);
        veterinarian.setFullName(request.fullName());
        veterinarian.setLicenseNumber(request.licenseNumber());
        return getVeterinarianResponseDTO(request, veterinarian);
    }

    private VeterinarianResponseDTO getVeterinarianResponseDTO(VeterinarianRequestDTO request, Veterinarian veterinarian) {
        veterinarian.setSpecializations(request.specializations());
        veterinarian.setBio(request.bio());
        veterinarian.setContactEmail(request.contactEmail());
        veterinarian.setPhoneNumber(request.phoneNumber());
        veterinarian.setClinicName(request.clinicName());
        veterinarian.setClinicAddress(request.clinicAddress());
        veterinarian.setCity(request.city());
        veterinarian.setState(request.state());
        veterinarian.setZipCode(request.zipCode());
        veterinarian.setCountry(request.country());
        veterinarian.setLatitude(request.latitude());
        veterinarian.setLongitude(request.longitude());
        veterinarian.setYearsOfExperience(request.yearsOfExperience());
        veterinarian.setCertifications(request.certifications());
        veterinarian.setLanguagesSpoken(request.languagesSpoken());
        veterinarian.setProfilePicture(request.profilePicture());
        veterinarian.setIsAvailableForChat(request.isAvailableForChat());
        veterinarian.setAcceptsNewPatients(request.acceptsNewPatients());
        veterinarian.setConsultationFee(request.consultationFee());

        Veterinarian savedVet = veterinarianRepository.save(veterinarian);
        return toResponseDTO(savedVet);
    }

    @Transactional(readOnly = true)
    public VeterinarianResponseDTO getVeterinarianById(UUID id) {
        Veterinarian veterinarian = veterinarianRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Veterinarian not found with id: " + id));
        return toResponseDTO(veterinarian);
    }

    @Transactional(readOnly = true)
    public Page<VeterinarianResponseDTO> getAllVeterinarians(Boolean verified, Boolean availableForChat, Pageable pageable) {
        Page<Veterinarian> veterinarians;
        
        if (verified != null) {
            veterinarians = veterinarianRepository.findByIsVerified(verified, pageable);
        } else if (availableForChat != null) {
            veterinarians = veterinarianRepository.findByIsAvailableForChat(availableForChat, pageable);
        } else {
            veterinarians = veterinarianRepository.findAll(pageable);
        }
        
        return veterinarians.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<VeterinarianResponseDTO> searchVeterinarians(
            String query,
            VeterinarianSpecialization specialty,
            String city,
            String state,
            Integer minExperience,
            Boolean onlineConsultation,
            Pageable pageable) {
        Page<Veterinarian> veterinarians;
        
        if (query != null && !query.trim().isEmpty()) {
            veterinarians = veterinarianRepository.searchVeterinarians(query.trim(), pageable);
        } else {
            if (specialty != null) {
                veterinarians = veterinarianRepository.findBySpecialization(specialty, pageable);
            } else {
                veterinarians = veterinarianRepository.findAll(pageable);
            }
        }

        return veterinarians.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<VeterinarianResponseDTO> getBySpecialization(VeterinarianSpecialization specialization, Pageable pageable) {
        Page<Veterinarian> veterinarians = veterinarianRepository.findBySpecialization(specialization, pageable);
        return veterinarians.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<VeterinarianResponseDTO> getNearbyVeterinarians(Double latitude, Double longitude, Double radiusKm) {
        List<Veterinarian> veterinarians = veterinarianRepository.findNearby(latitude, longitude, radiusKm);
        return veterinarians.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VeterinarianResponseDTO> getTopRatedVeterinarians(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Veterinarian> veterinarians = veterinarianRepository.findTopRated(pageable);
        return veterinarians.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public VeterinarianResponseDTO updateVeterinarian(UUID id, VeterinarianRequestDTO request) {
        Veterinarian veterinarian = veterinarianRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Veterinarian not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!veterinarian.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new SecurityException("You can only update your own profile");
        }
        
        veterinarian.setFullName(request.fullName());
        return getVeterinarianResponseDTO(request, veterinarian);
    }

    public void deleteVeterinarian(UUID id) {
        Veterinarian veterinarian = veterinarianRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Veterinarian not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!veterinarian.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new SecurityException("You can only delete your own profile");
        }
        
        veterinarianRepository.delete(veterinarian);
    }

    private VeterinarianResponseDTO toResponseDTO(Veterinarian vet) {
        return new VeterinarianResponseDTO(
                vet.getVeterinarianId(),
                vet.getUser().getUserId(),
                vet.getFullName(),
                vet.getLicenseNumber(),
                vet.getSpecializations(),
                vet.getBio(),
                vet.getContactEmail(),
                vet.getPhoneNumber(),
                vet.getClinicName(),
                vet.getClinicAddress(),
                vet.getCity(),
                vet.getState(),
                vet.getZipCode(),
                vet.getCountry(),
                vet.getLatitude(),
                vet.getLongitude(),
                vet.getYearsOfExperience(),
                vet.getCertifications(),
                vet.getLanguagesSpoken(),
                vet.getProfilePicture(),
                vet.getIsVerified(),
                vet.getIsAvailableForChat(),
                vet.getRating(),
                vet.getConsultationFee(),
                vet.getReviewCount(),
                vet.getAcceptsNewPatients(),
                vet.getCreatedAt(),
                vet.getUpdatedAt()
        );
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
