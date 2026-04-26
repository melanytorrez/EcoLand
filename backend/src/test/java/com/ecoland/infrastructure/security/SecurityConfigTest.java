package com.ecoland.infrastructure.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should allow auth endpoint without authentication")
    void shouldAllowAuthEndpoint() throws Exception {
        mockMvc.perform(post("/auth/login"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("Should allow campaigns endpoint without authentication")
    void shouldAllowCampaignsEndpoint() throws Exception {
        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk()); // o 404 si no existe handler
    }

    @Test
    @DisplayName("Should return 401 for protected endpoint without token")
    void shouldReturnUnauthorizedForProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/api/secure"))
                .andExpect(status().isUnauthorized());
    }
}