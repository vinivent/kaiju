package com.cesar.kaiju.repository;

import com.cesar.kaiju.model.User;
import com.cesar.kaiju.model.UserVerified;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserVerifiedRepository extends JpaRepository<UserVerified, UUID> {
    Optional<UserVerified> findByUser(User user);
    Optional<UserVerified> findByVerificationToken(String token);
}
