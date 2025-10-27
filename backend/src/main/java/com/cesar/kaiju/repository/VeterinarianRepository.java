package com.cesar.kaiju.repository;

import com.cesar.kaiju.enums.VeterinarianSpecialization;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.model.Veterinarian;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VeterinarianRepository extends JpaRepository<Veterinarian, UUID> {
    
    Optional<Veterinarian> findByUser(User user);
    
    Optional<Veterinarian> findByLicenseNumber(String licenseNumber);
    
    Page<Veterinarian> findByIsVerified(Boolean isVerified, Pageable pageable);
    
    Page<Veterinarian> findByIsAvailableForChat(Boolean isAvailableForChat, Pageable pageable);
    
    @Query("SELECT v FROM Veterinarian v JOIN v.specializations s WHERE s = :specialization AND v.isVerified = true")
    Page<Veterinarian> findBySpecialization(@Param("specialization") VeterinarianSpecialization specialization, Pageable pageable);
    
    @Query("SELECT v FROM Veterinarian v WHERE v.isVerified = true AND " +
           "(LOWER(v.city) = LOWER(:city) OR LOWER(v.state) = LOWER(:state))")
    Page<Veterinarian> findByLocation(@Param("city") String city, @Param("state") String state, Pageable pageable);
    
    @Query("SELECT v FROM Veterinarian v WHERE v.isVerified = true AND " +
           "(LOWER(v.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.clinicName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.bio) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Veterinarian> searchVeterinarians(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT v FROM Veterinarian v WHERE v.isVerified = true ORDER BY v.rating DESC, v.reviewCount DESC")
    List<Veterinarian> findTopRated(Pageable pageable);
    
    @Query("SELECT v FROM Veterinarian v WHERE v.isVerified = true AND v.latitude IS NOT NULL AND v.longitude IS NOT NULL AND " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(v.latitude)) * cos(radians(v.longitude) - radians(:lon)) + " +
           "sin(radians(:lat)) * sin(radians(v.latitude)))) <= :radius")
    List<Veterinarian> findNearby(@Param("lat") Double latitude, @Param("lon") Double longitude, @Param("radius") Double radiusKm);
}
