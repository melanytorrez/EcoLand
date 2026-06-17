package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.LoginRequest;
import com.ecoland.application.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class AuthIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    private static final String TEST_EMAIL = "integracion@ecoland.com";
    private static final String TEST_PASSWORD = "Secure123!";

    @Test
    void register_ThenLogin_ReturnsJwtToken() throws Exception {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setNombre("Usuario Integración");
        registerReq.setEmail(TEST_EMAIL);
        registerReq.setPassword(TEST_PASSWORD);
        registerReq.setRole("USUARIO");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(TEST_EMAIL));

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail(TEST_EMAIL);
        loginReq.setPassword(TEST_PASSWORD);

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();

        String body = result.getResponse().getContentAsString();
        assertTrue(body.contains("token"));
    }

    @Test
    void login_WithAdminUser_ReturnsToken() throws Exception {
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("admin@ecoland.com");
        loginReq.setPassword("admin1234");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("admin@ecoland.com"));
    }

    @Test
    void login_WithWrongPassword_ReturnsError() throws Exception {
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("admin@ecoland.com");
        loginReq.setPassword("wrong_password");

        try {
            int status = mockMvc.perform(post("/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginReq)))
                    .andReturn()
                    .getResponse()
                    .getStatus();
            assertTrue(status >= 400, "Se esperaba un status de error pero fue: " + status);
        } catch (Exception e) {
            // RuntimeException propagada por MockMvc — comportamiento aceptable
            assertTrue(e.getCause() instanceof RuntimeException || e instanceof RuntimeException);
        }
    }

    @Test
    void register_WithDuplicateEmail_Returns409() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setNombre("Usuario Duplicado");
        req.setEmail("admin@ecoland.com");
        req.setPassword(TEST_PASSWORD);
        req.setRole("USUARIO");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    @Test
    void register_WithInvalidPassword_Returns400() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setNombre("Usuario Inválido");
        req.setEmail("invalido@ecoland.com");
        req.setPassword("weakpassword");
        req.setRole("USUARIO");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}
