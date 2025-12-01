package com.cesar.kaiju.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${APP.MAIL.SENDER.EMAIL}")
    private String senderEmail;

    public MailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async("emailExecutor")
    public void sendEmail(String recipientEmail, String subject, String templateName,
                          Map<String, Object> variables) {
        try {
            String htmlContent = renderTemplate(templateName, variables);
            sendMimeMessage(recipientEmail, subject, htmlContent);
            logger.info("Email sent to {} with subject '{}'", recipientEmail, subject);
        } catch (MailException | MessagingException e) {
            logger.error("Failed to send email to {}: {}", recipientEmail, e.getMessage());
        }
    }

    private String renderTemplate(String templateName, Map<String, Object> variables) {
        Context context = new Context();
        context.setVariables(variables);
        return templateEngine.process("emails/" + templateName, context);
    }

    private void sendMimeMessage(String recipient, String subject, String htmlContent)
            throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);
        helper.setTo(recipient);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendAccountVerificationEmail(String email, String verificationUrl, String username) {
        Map<String, Object> variables = Map.of(
                "username", username,
                "verificationUrl", verificationUrl
        );

        sendEmail(email, "Verifique sua conta - Kaiju", "account-verification", variables);
    }

    public void sendPasswordResetEmail(String email, String resetUrl, String username) {
        Map<String, Object> variables = Map.of(
                "username", username,
                "resetUrl", resetUrl
        );

        sendEmail(email, "Redefinição de senha - Kaiju", "password-reset", variables);
    }

    public void sendResendVerificationEmail(String email, String verificationUrl, String username) {
        Map<String, Object> variables = Map.of(
                "username", username,
                "verificationUrl", verificationUrl
        );

        sendEmail(email, "🚨 Novo link de verificação - Kaiju", "account-verification", variables);
    }
}