package com.cesar.kaiju.repository;

import com.cesar.kaiju.enums.LocationType;
import com.cesar.kaiju.model.HealthcareLocation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HealthcareLocationRepository extends JpaRepository<HealthcareLocation, UUID> {
    
    Page<HealthcareLocation> findByIsActiveAndIsVerified(Boolean isActive, Boolean isVerified, Pageable pageable);
    
    Page<HealthcareLocation> findByLocationType(LocationType locationType, Pageable pageable);
    
    Page<HealthcareLocation> findByLocationTypeAndIsActiveAndIsVerified(
        LocationType locationType, Boolean isActive, Boolean isVerified, Pageable pageable);
    
    @Query("SELECT h FROM HealthcareLocation h WHERE h.isActive = true AND h.isVerified = true AND " +
           "(LOWER(h.city) = LOWER(:city) OR LOWER(h.state) = LOWER(:state))")
    Page<HealthcareLocation> findByLocation(@Param("city") String city, @Param("state") String state, Pageable pageable);
    
    @Query("SELECT h FROM HealthcareLocation h WHERE h.isActive = true AND h.isVerified = true AND " +
           "(LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<HealthcareLocation> searchLocations(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT h FROM HealthcareLocation h WHERE h.isActive = true AND h.isVerified = true AND " +
           "h.acceptsEmergencies = true")
    List<HealthcareLocation> findEmergencyLocations();
    
    @Query("SELECT h FROM HealthcareLocation h WHERE h.isActive = true AND h.isVerified = true AND " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(h.latitude)) * cos(radians(h.longitude) - radians(:lon)) + " +
           "sin(radians(:lat)) * sin(radians(h.latitude)))) <= :radius " +
           "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(h.latitude)) * " +
           "cos(radians(h.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(h.latitude))))")
    List<HealthcareLocation> findNearby(@Param("lat") Double latitude, @Param("lon") Double longitude, @Param("radius") Double radiusKm);
    
    @Query("SELECT h FROM HealthcareLocation h WHERE h.isActive = true AND h.isVerified = true " +
           "ORDER BY h.rating DESC, h.reviewCount DESC")
    List<HealthcareLocation> findTopRated(Pageable pageable);
}
