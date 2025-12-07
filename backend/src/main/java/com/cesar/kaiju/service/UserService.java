package com.cesar.kaiju.service;

import com.cesar.kaiju.dto.UserRegisterRequestDTO;
import com.cesar.kaiju.dto.UserUpdateRequestDTO;
import com.cesar.kaiju.enums.UserRole;
import com.cesar.kaiju.enums.UserSituation;
import com.cesar.kaiju.exception.EmailAlreadyUsedException;
import com.cesar.kaiju.exception.UsernameAlreadyUsedExcpetion;
import com.cesar.kaiju.model.PasswordResetToken;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.model.UserVerified;
import com.cesar.kaiju.repository.PasswordResetTokenRepository;
import com.cesar.kaiju.repository.UserRepository;
import com.cesar.kaiju.repository.UserVerifiedRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserVerifiedRepository userVerifiedRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            UserVerifiedRepository userVerifiedRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userVerifiedRepository = userVerifiedRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return user;
    }

    public void createUser(UserRegisterRequestDTO request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new UsernameAlreadyUsedExcpetion("Username já está em uso.");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyUsedException("Email já está em uso.");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setRole(request.userRole() != null ? request.userRole() : UserRole.USER);
        user.setSituation(UserSituation.PENDING);

        User savedUser = userRepository.save(user);

        // Set user as verified directly (email verification disabled)
        savedUser.setSituation(UserSituation.VERIFIED);
        userRepository.save(savedUser);
    }

    public String verifyUser(String token) {
        UserVerified verification = userVerifiedRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token de verificação inválido."));

        if (verification.isVerified()) {
            return "Usuário já foi verificado anteriormente.";
        }

        if (verification.isExpired()) {
            throw new IllegalArgumentException("Token de verificação expirado. Solicite um novo link.");
        }

        User user = verification.getUser();
        user.setSituation(UserSituation.VERIFIED);
        userRepository.save(user);

        verification.setVerifiedAt(new Date());
        userVerifiedRepository.save(verification);

        return "Usuário verificado com sucesso!";
    }

    public void resendVerificationEmail(String email) {
        // Email verification disabled
        throw new UnsupportedOperationException("Verificação de email está desabilitada.");
    }

    public void sendResetPasswordEmail(String email) {
        // Email functionality disabled
        throw new UnsupportedOperationException("Funcionalidade de reset de senha por email está desabilitada.");
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token de redefinição inválido."));

        if (resetToken.isExpired()) {
            throw new IllegalArgumentException("Token de redefinição expirado. Solicite um novo link.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete used token
        passwordResetTokenRepository.deleteByToken(token);
    }

    public boolean validateResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .map(resetToken -> !resetToken.isExpired())
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
    }

    public void updateUser(UUID userId, UserUpdateRequestDTO request) {
        User user = getUserById(userId);

        // Check if username is being changed and if it's already taken
        if (request.username() != null && !request.username().equals(user.getUsername())) {
            if (userRepository.findByUsername(request.username()).isPresent()) {
                throw new UsernameAlreadyUsedExcpetion("Username já está em uso.");
            }
            user.setUsername(request.username());
        }

        if (request.name() != null) {
            user.setName(request.name());
        }

        if (request.description() != null) {
            user.setDescription(request.description());
        }

        if (request.avatar() != null) {
            user.setAvatar(request.avatar());
        }

        if (request.header() != null) {
            user.setHeader(request.header());
        }

        if (request.password() != null && !request.password().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        userRepository.save(user);
    }

    public void deleteUser(UUID userId) {
        User user = getUserById(userId);

        // Delete related entities
        userVerifiedRepository.findByUser(user).ifPresent(userVerifiedRepository::delete);
        passwordResetTokenRepository.deleteByUser(user);

        userRepository.delete(user);
    }

    public void becomeVeterinarian(UUID userId) {
        User user = getUserById(userId);
        user.setRole(UserRole.VETERINARIAN);
        userRepository.save(user);
    }

    public void becomeSeller(UUID userId) {
        User user = getUserById(userId);
        user.setRole(UserRole.SELLER);
        userRepository.save(user);
    }
}

