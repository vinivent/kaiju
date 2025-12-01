package com.cesar.kaiju.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // Rate limit configurations
    private static final int MAX_REQUESTS_PER_MINUTE = 5; // For registration
    private static final int MAX_LOGIN_ATTEMPTS = 10; // For login
    private static final int MAX_PASSWORD_RESET_ATTEMPTS = 3; // For password reset
    private static final int MAX_VERIFICATION_RESEND = 3; // For resend verification
    
    // Time windows in milliseconds
    private static final long ONE_MINUTE = 60_000;
    
    // Store request counts per IP
    private final ConcurrentHashMap<String, RequestCounter> requestCounters = new ConcurrentHashMap<>();
    
    private static class RequestCounter {
        private final AtomicInteger count = new AtomicInteger(0);
        private volatile long resetTime;
        
        RequestCounter(long resetTime) {
            this.resetTime = resetTime;
        }
        
        int incrementAndGet(long currentTime) {
            if (currentTime > resetTime) {
                count.set(0);
                resetTime = currentTime + ONE_MINUTE;
            }
            return count.incrementAndGet();
        }
        
        int get() {
            return count.get();
        }
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        String clientIp = getClientIpAddress(request);
        long currentTime = System.currentTimeMillis();
        
        // Apply rate limiting based on endpoint
        if (path.equals("/api/auth/register")) {
            if (!checkRateLimit(clientIp, MAX_REQUESTS_PER_MINUTE, currentTime)) {
                sendRateLimitResponse(response, "Muitas tentativas de registro. Tente novamente em alguns minutos.");
                return;
            }
        } else if (path.equals("/api/auth/login")) {
            if (!checkRateLimit(clientIp, MAX_LOGIN_ATTEMPTS, currentTime)) {
                sendRateLimitResponse(response, "Muitas tentativas de login. Tente novamente em alguns minutos.");
                return;
            }
        } else if (path.equals("/api/auth/forgot-password") || path.equals("/api/auth/resend-verification")) {
            int maxAttempts = path.contains("forgot-password") ? MAX_PASSWORD_RESET_ATTEMPTS : MAX_VERIFICATION_RESEND;
            if (!checkRateLimit(clientIp, maxAttempts, currentTime)) {
                String message = path.contains("forgot-password") 
                    ? "Muitas tentativas de recuperação de senha. Tente novamente em alguns minutos."
                    : "Muitas tentativas de reenvio. Tente novamente em alguns minutos.";
                sendRateLimitResponse(response, message);
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean checkRateLimit(String clientIp, int maxRequests, long currentTime) {
        RequestCounter counter = requestCounters.computeIfAbsent(
            clientIp, 
            k -> new RequestCounter(currentTime + ONE_MINUTE)
        );
        
        int currentCount = counter.incrementAndGet(currentTime);
        return currentCount <= maxRequests;
    }
    
    private void sendRateLimitResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}

