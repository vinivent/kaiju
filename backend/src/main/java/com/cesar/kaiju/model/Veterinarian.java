package com.cesar.kaiju.model;

import com.cesar.kaiju.enums.VeterinarianSpecialization;
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
@Table(name = "veterinarians")
@Getter
@Setter
public class Veterinarian {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID veterinarianId;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(nullable = false)
    @NotBlank(message = "Full name is required")
    @Size(max = 200)
    private String fullName;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @ElementCollection
    @CollectionTable(name = "veterinarian_specializations", joinColumns = @JoinColumn(name = "veterinarian_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "specialization")
    private List<VeterinarianSpecialization> specializations;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(nullable = false)
    @Email
    private String contactEmail;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 500)
    private String clinicName;

    @Column(columnDefinition = "TEXT")
    private String clinicAddress;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 20)
    private String zipCode;

    @Column(length = 100)
    private String country;

    private Double latitude;

    private Double longitude;

    private Integer yearsOfExperience;

    @ElementCollection
    @CollectionTable(name = "veterinarian_certifications", joinColumns = @JoinColumn(name = "veterinarian_id"))
    @Column(name = "certification")
    private List<String> certifications;

    @ElementCollection
    @CollectionTable(name = "veterinarian_languages", joinColumns = @JoinColumn(name = "veterinarian_id"))
    @Column(name = "language")
    private List<String> languagesSpoken;

    @Column(length = 500)
    private String profilePicture;

    @Column(nullable = false)
    private Boolean isVerified;

    @Column(nullable = false)
    private Boolean isAvailableForChat;

    private Double rating;

    private Integer reviewCount;

    private Double consultationFee;

    @Column(nullable = false)
    private Boolean acceptsNewPatients;

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
        if (isAvailableForChat == null) isAvailableForChat = true;
        if (acceptsNewPatients == null) acceptsNewPatients = true;
        if (rating == null) rating = 0.0;
        if (reviewCount == null) reviewCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
