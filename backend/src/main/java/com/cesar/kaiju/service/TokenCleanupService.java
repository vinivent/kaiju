package com.cesar.kaiju.service;

import com.cesar.kaiju.model.PasswordResetToken;
import com.cesar.kaiju.repository.PasswordResetTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TokenCleanupService {

    private final PasswordResetTokenRepository resetTokenRepository;

    public TokenCleanupService(PasswordResetTokenRepository resetTokenRepository) {
        this.resetTokenRepository = resetTokenRepository;
    }

    @Scheduled(fixedRate = 3600000)
    public void cleanExpiredTokens() {

        List<PasswordResetToken> expiredTokens = resetTokenRepository.findAll().stream()
                .filter(token -> token.getExpiration().isBefore(Instant.now()))  // Verifica se o token expirou
                .toList();

        for (PasswordResetToken token : expiredTokens) {
            resetTokenRepository.deleteByToken(token.getToken());

            System.out.println("Removed expired token: " + token.getToken());
        }
    }
}
