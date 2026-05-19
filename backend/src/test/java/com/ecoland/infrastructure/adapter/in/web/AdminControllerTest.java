package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.service.FeatureToggleService;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.security.FeatureToggleInterceptor;
import com.ecoland.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioUseCase usuarioUseCase;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioRepositoryPort usuarioRepositoryPort;

    @MockBean
    private FeatureToggleInterceptor featureToggleInterceptor;

    @MockBean
    private FeatureToggleService featureToggleService;

    private Usuario leader;

    @BeforeEach
    void setUp() throws Exception {
        when(featureToggleInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        leader = new Usuario();
        leader.setId(1L);
        leader.setNombre("Juan Líder");
        leader.setEmail("lider@ecoland.com");
    }

    @Test
    void getPendingLeaderRequests_ShouldReturnList() throws Exception {
        when(usuarioUseCase.getPendingLeaderRequests()).thenReturn(Arrays.asList(leader));

        mockMvc.perform(get("/api/v1/admin/leader-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("lider@ecoland.com"));
    }

    @Test
    void getPendingLeaderRequests_WhenEmpty_ShouldReturnEmptyList() throws Exception {
        when(usuarioUseCase.getPendingLeaderRequests()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/admin/leader-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void approveLeaderRequest_Success_ShouldReturn200() throws Exception {
        doNothing().when(usuarioUseCase).approveLeaderRequest(1L);

        mockMvc.perform(post("/api/v1/admin/leader-requests/1/approve"))
                .andExpect(status().isOk());

        verify(usuarioUseCase, times(1)).approveLeaderRequest(1L);
    }

    @Test
    void approveLeaderRequest_WhenUserNotFound_ShouldReturn400() throws Exception {
        doThrow(new RuntimeException("Usuario no encontrado")).when(usuarioUseCase).approveLeaderRequest(99L);

        mockMvc.perform(post("/api/v1/admin/leader-requests/99/approve"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectLeaderRequest_Success_ShouldReturn200() throws Exception {
        doNothing().when(usuarioUseCase).rejectLeaderRequest(1L);

        mockMvc.perform(post("/api/v1/admin/leader-requests/1/reject"))
                .andExpect(status().isOk());

        verify(usuarioUseCase, times(1)).rejectLeaderRequest(1L);
    }

    @Test
    void rejectLeaderRequest_WhenUserNotFound_ShouldReturn400() throws Exception {
        doThrow(new RuntimeException("Usuario no encontrado")).when(usuarioUseCase).rejectLeaderRequest(99L);

        mockMvc.perform(post("/api/v1/admin/leader-requests/99/reject"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() throws Exception {
        Usuario user2 = new Usuario();
        user2.setId(2L);
        user2.setEmail("user2@ecoland.com");

        when(usuarioUseCase.getAllUsuarios()).thenReturn(Arrays.asList(leader, user2));

        mockMvc.perform(get("/api/v1/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
