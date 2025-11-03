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
import com.cesar.kaiju.repository.ArticleRepository;
import com.cesar.kaiju.repository.ChatConversationRepository;
import com.cesar.kaiju.repository.ChatMessageRepository;
import com.cesar.kaiju.repository.PasswordResetTokenRepository;
import com.cesar.kaiju.repository.ProductRepository;
import com.cesar.kaiju.repository.ProductReviewRepository;
import com.cesar.kaiju.repository.UserRepository;
import com.cesar.kaiju.repository.UserVerifiedRepository;
import com.cesar.kaiju.repository.VeterinarianRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final MailService mailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserVerifiedRepository userVerifiedRepository;
    private final PasswordEncoder passwordEncoder;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatConversationRepository chatConversationRepository;
    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final ArticleRepository articleRepository;
    private final VeterinarianRepository veterinarianRepository;

    public UserService(UserRepository userRepository, MailService mailService, PasswordResetTokenRepository passwordResetTokenRepository, UserVerifiedRepository userVerifiedRepository, PasswordEncoder passwordEncoder, ChatMessageRepository chatMessageRepository, ChatConversationRepository chatConversationRepository, ProductReviewRepository productReviewRepository, ProductRepository productRepository, ArticleRepository articleRepository, VeterinarianRepository veterinarianRepository) {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.userVerifiedRepository = userVerifiedRepository;
        this.passwordEncoder = passwordEncoder;
        this.chatMessageRepository = chatMessageRepository;
        this.chatConversationRepository = chatConversationRepository;
        this.productReviewRepository = productReviewRepository;
        this.productRepository = productRepository;
        this.articleRepository = articleRepository;
        this.veterinarianRepository = veterinarianRepository;
    }

    public void createUser(UserRegisterRequestDTO request) {
        userRepository.findByEmail(request.email().trim().toLowerCase())
                .ifPresent(user -> {
                    throw new EmailAlreadyUsedException("Esse e-mail já está em uso.");
                });

        userRepository.findByUsername(request.username().trim().toLowerCase())
                .ifPresent(user -> {
                    throw new UsernameAlreadyUsedExcpetion("Esse nome de usuário já está em uso.");
                });

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setSituation(UserSituation.PENDING);
        if (request.userRole() != null) {
            user.setRole(request.userRole());
        } else {
            user.setRole(UserRole.USER);
        }
        userRepository.save(user);

        UserVerified verification = createAndSaveVerificationToken(user);
        userVerifiedRepository.save(verification);

        String url = "https://kaiju.com/verify/" + verification.getVerificationToken();
        mailService.sendAccountVerificationEmail(user.getEmail(), url, user.getUsername());

    }

    public List<User> readUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));
    }

    @Transactional
    public void updateUser(UUID userID, UserUpdateRequestDTO request) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        if (request.username() != null) {
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
        if (request.password() != null) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        userRepository.save(user);

    }
    
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        chatMessageRepository.deleteBySender(user);

        chatConversationRepository.deleteByUser(user);
        
        productReviewRepository.deleteByUser(user);

        productRepository.deleteBySeller(user);

        articleRepository.deleteByAuthor(user);

        passwordResetTokenRepository.deleteByUser(user);

        userVerifiedRepository.deleteByUser(user);

        veterinarianRepository.findByUser(user).ifPresent(veterinarianRepository::delete);

        userRepository.delete(user);
    }


    public String verifyUser(String token) {
        Optional<UserVerified> optionalUserVerified = userVerifiedRepository.findByVerificationToken(token);

        if (optionalUserVerified.isEmpty())
            return "Token inválido ou expirado.";

        UserVerified verification = optionalUserVerified.get();

        if (verification.isExpired())
            return "Token expirado. Solicite um novo.";

        User user = verification.getUser();
        user.setSituation(UserSituation.VERIFIED);
        userRepository.save(user);
        userVerifiedRepository.delete(verification);

        return "Conta verificada com sucesso!";
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        Optional<UserVerified> existing = userVerifiedRepository.findByUser(user);

        if (existing.isPresent() && !existing.get().isExpired()) {
            throw new IllegalArgumentException("Você possui um link válido, cheque seu e-mail.");
        }

        existing.ifPresent(userVerifiedRepository::delete);

        UserVerified newVerification = createAndSaveVerificationToken(user);

        String url = "https://kaiju.com/verify/" + newVerification.getVerificationToken();
        mailService.sendResendVerificationEmail(user.getEmail(), url, user.getUsername());
    }


    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        passwordResetTokenRepository.deleteByUser(user); // limpa tokens antigos

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiration(Instant.now().plusSeconds(900)); // 15 min
        passwordResetTokenRepository.save(token);

        String resetUrl = "https://kaiju.com/reset-password/" + token.getToken();
        mailService.sendPasswordResetEmail(user.getEmail(), resetUrl, user.getUsername());
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido ou expirado."));

        if (resetToken.getExpiration().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Token expirado. Solicite um novo.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));  // Criptografa a nova senha
        userRepository.save(user);

        passwordResetTokenRepository.deleteByToken(resetToken.getToken());
    }

    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> resetToken = passwordResetTokenRepository.findByToken(token);
        return resetToken.isPresent() && resetToken.get().getExpiration().isAfter(Instant.now());
    }


    private UserVerified createAndSaveVerificationToken(User user) {
        UserVerified verification = new UserVerified();
        verification.setUser(user);
        verification.setVerificationToken(UUID.randomUUID().toString());
        verification.setCreatedAt(new Date());
        verification.setExpiresAt(new Date(System.currentTimeMillis() + (long) 900000));

        return userVerifiedRepository.save(verification);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }
}