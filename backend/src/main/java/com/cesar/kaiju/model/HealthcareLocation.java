package com.cesar.kaiju.model;

import com.cesar.kaiju.enums.LocationType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "healthcare_locations")
@Getter
@Setter
public class HealthcareLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID locationId;

    @Column(nullable = false)
    @NotBlank(message = "Location name is required")
    @Size(max = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationType locationType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Address is required")
    private String address;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "City is required")
    private String city;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "State is required")
    private String state;

    @Column(length = 20)
    private String zipCode;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Country is required")
    private String country;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 20)
    private String phoneNumber;

    @Email
    private String email;

    @Column(length = 500)
    private String website;

    @ElementCollection
    @CollectionTable(name = "location_services", joinColumns = @JoinColumn(name = "location_id"))
    @Column(name = "service")
    private List<String> servicesOffered;

    @Column(length = 500)
    private String operatingHours;

    @Column(nullable = false)
    private Boolean acceptsEmergencies;

    @Column(nullable = false)
    private Boolean requiresAppointment;

    @ElementCollection
    @CollectionTable(name = "location_images", joinColumns = @JoinColumn(name = "location_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ManyToMany
    @JoinTable(
        name = "location_veterinarians",
        joinColumns = @JoinColumn(name = "location_id"),
        inverseJoinColumns = @JoinColumn(name = "veterinarian_id")
    )
    private List<Veterinarian> veterinarians;

    @Column(nullable = false)
    private Boolean isVerified;

    private Double rating;

    private Integer reviewCount;

    @Column(nullable = false)
    private Boolean isActive;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    @Column(nullable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
        if (isVerified == null) isVerified = false;
        if (isActive == null) isActive = true;
        if (acceptsEmergencies == null) acceptsEmergencies = false;
        if (requiresAppointment == null) requiresAppointment = true;
        if (rating == null) rating = 0.0;
        if (reviewCount == null) reviewCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
