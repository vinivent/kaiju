package com.cesar.kaiju.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "user_verifications")
@Getter
@Setter
public class UserVerified {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String verificationToken;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    private Date expiresAt;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "America/Sao_Paulo")
    private Date verifiedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        expiresAt = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000); // 24h
    }

    public boolean isExpired() {
        return new Date().after(expiresAt);
    }

    public boolean isVerified() {
        return verifiedAt != null;
    }
}