package com.cesar.kaiju.service;

import com.cesar.kaiju.dto.HealthcareLocationRequestDTO;
import com.cesar.kaiju.dto.HealthcareLocationResponseDTO;
import com.cesar.kaiju.enums.LocationType;
import com.cesar.kaiju.model.HealthcareLocation;
import com.cesar.kaiju.repository.HealthcareLocationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class HealthcareLocationService {

    private final HealthcareLocationRepository locationRepository;

    public HealthcareLocationService(HealthcareLocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public HealthcareLocationResponseDTO createLocation(HealthcareLocationRequestDTO request) {
        HealthcareLocation location = new HealthcareLocation();
        location.setName(request.name());
        location.setLocationType(request.locationType());
        location.setDescription(request.description());
        location.setAddress(request.address());
        location.setCity(request.city());
        location.setState(request.state());
        location.setZipCode(request.zipCode());
        location.setCountry(request.country());
        location.setLatitude(request.latitude());
        location.setLongitude(request.longitude());
        location.setPhoneNumber(request.phoneNumber());
        location.setEmail(request.email());
        location.setWebsite(request.website());
        location.setServicesOffered(request.servicesOffered());
        location.setOperatingHours(request.operatingHours());
        location.setAcceptsEmergencies(request.acceptsEmergencies());
        location.setRequiresAppointment(request.requiresAppointment());
        location.setImages(request.images());
        
        HealthcareLocation savedLocation = locationRepository.save(location);
        return toResponseDTO(savedLocation);
    }

    @Transactional(readOnly = true)
    public HealthcareLocationResponseDTO getLocationById(UUID id) {
        HealthcareLocation location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        return toResponseDTO(location);
    }

    @Transactional(readOnly = true)
    public Page<HealthcareLocationResponseDTO> getAllLocations(LocationType type, Pageable pageable) {
        Page<HealthcareLocation> locations;
        
        if (type != null) {
            locations = locationRepository.findByLocationTypeAndIsActiveAndIsVerified(type, true, true, pageable);
        } else {
            locations = locationRepository.findByIsActiveAndIsVerified(true, true, pageable);
        }
        
        return locations.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<HealthcareLocationResponseDTO> searchLocations(
            String query, 
            LocationType type, 
            String city, 
            String state,
            Boolean emergencyService,
            Boolean hours24,
            Boolean acceptsInsurance,
            Pageable pageable) {
        Page<HealthcareLocation> locations;
        
        // If query is provided, use search; otherwise use getAllLocations
        if (query != null && !query.trim().isEmpty()) {
            locations = locationRepository.searchLocations(query.trim(), pageable);
        } else {
            // Fall back to getAllLocations with type filter
            if (type != null) {
                locations = locationRepository.findByLocationTypeAndIsActiveAndIsVerified(type, true, true, pageable);
            } else {
                locations = locationRepository.findByIsActiveAndIsVerified(true, true, pageable);
            }
        }
        
        // Note: Additional filters (city, state, emergencyService, hours24, acceptsInsurance) 
        // would ideally be handled in a comprehensive repository query for better performance.
        // For now, basic filtering by type and active/verified status is implemented.
        // The model uses 'acceptsEmergencies' (not emergencyService) and 'operatingHours' (not hours24 boolean).
        
        return locations.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<HealthcareLocationResponseDTO> getByLocation(String city, String state, Pageable pageable) {
        Page<HealthcareLocation> locations = locationRepository.findByLocation(city, state, pageable);
        return locations.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<HealthcareLocationResponseDTO> getNearbyLocations(Double latitude, Double longitude, Double radiusKm) {
        List<HealthcareLocation> locations = locationRepository.findNearby(latitude, longitude, radiusKm);
        return locations.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HealthcareLocationResponseDTO> getEmergencyLocations() {
        List<HealthcareLocation> locations = locationRepository.findEmergencyLocations();
        return locations.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HealthcareLocationResponseDTO> getTopRatedLocations(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<HealthcareLocation> locations = locationRepository.findTopRated(pageable);
        return locations.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public HealthcareLocationResponseDTO updateLocation(UUID id, HealthcareLocationRequestDTO request) {
        HealthcareLocation location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        
        location.setName(request.name());
        location.setLocationType(request.locationType());
        location.setDescription(request.description());
        location.setAddress(request.address());
        location.setCity(request.city());
        location.setState(request.state());
        location.setZipCode(request.zipCode());
        location.setCountry(request.country());
        location.setLatitude(request.latitude());
        location.setLongitude(request.longitude());
        location.setPhoneNumber(request.phoneNumber());
        location.setEmail(request.email());
        location.setWebsite(request.website());
        location.setServicesOffered(request.servicesOffered());
        location.setOperatingHours(request.operatingHours());
        location.setAcceptsEmergencies(request.acceptsEmergencies());
        location.setRequiresAppointment(request.requiresAppointment());
        location.setImages(request.images());
        
        HealthcareLocation updatedLocation = locationRepository.save(location);
        return toResponseDTO(updatedLocation);
    }

    public void verifyLocation(UUID id) {
        HealthcareLocation location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        location.setIsVerified(true);
        locationRepository.save(location);
        // TODO: Send verification notification
    }

    public void updateActiveStatus(UUID id, Boolean active) {
        HealthcareLocation location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        location.setIsActive(active);
        locationRepository.save(location);
    }

    public void deleteLocation(UUID id) {
        HealthcareLocation location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        locationRepository.delete(location);
    }

    private HealthcareLocationResponseDTO toResponseDTO(HealthcareLocation location) {
        return new HealthcareLocationResponseDTO(
                location.getLocationId(),
                location.getName(),
                location.getLocationType(),
                location.getDescription(),
                location.getAddress(),
                location.getCity(),
                location.getState(),
                location.getZipCode(),
                location.getCountry(),
                location.getLatitude(),
                location.getLongitude(),
                location.getPhoneNumber(),
                location.getEmail(),
                location.getWebsite(),
                location.getServicesOffered(),
                location.getOperatingHours(),
                location.getAcceptsEmergencies(),
                location.getRequiresAppointment(),
                location.getImages(),
                location.getIsVerified(),
                location.getRating(),
                location.getReviewCount(),
                location.getIsActive(),
                location.getCreatedAt(),
                location.getUpdatedAt()
        );
    }
}
