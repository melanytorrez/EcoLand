package com.ecoland.infrastructure.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService("test-secret-key-that-is-at-least-32-characters-long");

    @Test
    @DisplayName("Should generate a valid token")
    void shouldGenerateToken() {
        String token = jwtService.generateToken("test@mail.com");

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    @DisplayName("Should extract email from token")
    void shouldExtractEmail() {
        String email = "test@mail.com";
        String token = jwtService.generateToken(email);

        String extractedEmail = jwtService.extractEmail(token);

        assertThat(extractedEmail).isEqualTo(email);
    }

    @Test
    @DisplayName("Should validate a correct token")
    void shouldValidateToken() {
        String token = jwtService.generateToken("test@mail.com");

        boolean isValid = jwtService.isTokenValid(token);

        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Should return false for invalid token")
    void shouldReturnFalseForInvalidToken() {
        String invalidToken = "fake.token.value";

        boolean isValid = jwtService.isTokenValid(invalidToken);

        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should return false for tampered token")
    void shouldReturnFalseForTamperedToken() {
        String token = jwtService.generateToken("test@mail.com");

        String tamperedToken = token + "corrupted";

        boolean isValid = jwtService.isTokenValid(tamperedToken);

        assertThat(isValid).isFalse();
    }
}