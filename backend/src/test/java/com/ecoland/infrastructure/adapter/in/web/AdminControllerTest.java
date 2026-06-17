package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.service.FeatureToggleService;
import com.ecoland.application.service.RecyclingActivityService;
import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.model.VolunteerStatus;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.domain.port.in.VolunteerApplicationUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.entity.RecyclingActivityEntity;
import com.ecoland.infrastructure.security.FeatureToggleInterceptor;
import com.ecoland.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private UsuarioUseCase usuarioUseCase;
    @MockBean private VolunteerApplicationUseCase volunteerApplicationUseCase;
    @MockBean private RecyclingActivityService recyclingActivityService;
    @MockBean private JwtService jwtService;
    @MockBean private UsuarioRepositoryPort usuarioRepositoryPort;
    @MockBean private FeatureToggleInterceptor featureToggleInterceptor;
    @MockBean private FeatureToggleService featureToggleService;

    @BeforeEach
    void setUp() throws Exception {
        when(featureToggleInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }

    private Usuario buildUsuario() {
        Usuario u = new Usuario();
        u.setId(1L);
        u.setNombre("Admin User");
        u.setEmail("admin@ecoland.com");
        u.setRoles(new HashSet<>());
        return u;
    }

    private VolunteerApplication buildApplication() {
        VolunteerApplication app = new VolunteerApplication();
        app.setId(1L);
        app.setCampaignId(1L);
        app.setUsuarioEmail("voluntario@ecoland.com");
        app.setFullName("Voluntario Test");
        app.setAge(25);
        app.setPhone("71234567");
        app.setAvailableWeekends(true);
        app.setHasEnvironmentalExperience(false);
        app.setMotivation("Motivación");
        app.setAvailabilityHours("Mañanas");
        app.setStatus(VolunteerStatus.PENDING);
        app.setFechaPostulacion(LocalDateTime.now());
        return app;
    }

    private RecyclingActivityEntity buildActivity() {
        RecyclingActivityEntity e = new RecyclingActivityEntity();
        e.setId(1L);
        e.setUsuarioEmail("user@ecoland.com");
        e.setPuntoVerdeId(1L);
        e.setPuntoVerdeNombre("Punto Verde");
        e.setMaterial("plástico");
        e.setStatus(RecyclingActivityStatus.PENDING);
        e.setRegisteredAt(LocalDateTime.now());
        return e;
    }

    // --- Leader requests ---

    @Test
    void getPendingLeaderRequests_Returns200() throws Exception {
        when(usuarioUseCase.getPendingLeaderRequests()).thenReturn(List.of(buildUsuario()));

        mockMvc.perform(get("/api/v1/admin/leader-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("admin@ecoland.com"));
    }

    @Test
    void approveLeaderRequest_Returns200_WhenSuccess() throws Exception {
        doNothing().when(usuarioUseCase).approveLeaderRequest(1L);

        mockMvc.perform(post("/api/v1/admin/leader-requests/1/approve"))
                .andExpect(status().isOk());

        verify(usuarioUseCase).approveLeaderRequest(1L);
    }

    @Test
    void approveLeaderRequest_Returns400_WhenException() throws Exception {
        doThrow(new RuntimeException("Usuario no encontrado")).when(usuarioUseCase).approveLeaderRequest(99L);

        mockMvc.perform(post("/api/v1/admin/leader-requests/99/approve"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectLeaderRequest_Returns200_WhenSuccess() throws Exception {
        doNothing().when(usuarioUseCase).rejectLeaderRequest(1L);

        mockMvc.perform(post("/api/v1/admin/leader-requests/1/reject"))
                .andExpect(status().isOk());

        verify(usuarioUseCase).rejectLeaderRequest(1L);
    }

    @Test
    void rejectLeaderRequest_Returns400_WhenException() throws Exception {
        doThrow(new RuntimeException("Error")).when(usuarioUseCase).rejectLeaderRequest(99L);

        mockMvc.perform(post("/api/v1/admin/leader-requests/99/reject"))
                .andExpect(status().isBadRequest());
    }

    // --- Users ---

    @Test
    void getAllUsers_Returns200_WithList() throws Exception {
        when(usuarioUseCase.getAllUsuarios()).thenReturn(List.of(buildUsuario()));

        mockMvc.perform(get("/api/v1/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("admin@ecoland.com"));
    }

    @Test
    void getAllUsers_Returns200_WhenEmpty() throws Exception {
        when(usuarioUseCase.getAllUsuarios()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    // --- Volunteer applications ---

    @Test
    void getVolunteerApplications_Returns200_DefaultPending() throws Exception {
        when(volunteerApplicationUseCase.getApplicationsByStatus(VolunteerStatus.PENDING))
                .thenReturn(List.of(buildApplication()));

        mockMvc.perform(get("/api/v1/admin/volunteer-applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void approveVolunteerApplication_Returns200() throws Exception {
        VolunteerApplication accepted = buildApplication();
        accepted.setStatus(VolunteerStatus.ACCEPTED);
        when(volunteerApplicationUseCase.approveApplication(1L)).thenReturn(accepted);

        mockMvc.perform(post("/api/v1/admin/volunteer-applications/1/approve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));
    }

    @Test
    void rejectVolunteerApplication_Returns200() throws Exception {
        VolunteerApplication rejected = buildApplication();
        rejected.setStatus(VolunteerStatus.REJECTED);
        rejected.setAdminNotes("No cumple requisitos");
        when(volunteerApplicationUseCase.rejectApplication(eq(1L), anyString())).thenReturn(rejected);

        mockMvc.perform(post("/api/v1/admin/volunteer-applications/1/reject")
                        .param("adminNotes", "No cumple requisitos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));
    }

    // --- Recycling activities ---

    @Test
    void getRecyclingActivities_Returns200_DefaultPending() throws Exception {
        when(recyclingActivityService.getActivitiesByStatus(RecyclingActivityStatus.PENDING))
                .thenReturn(List.of(buildActivity()));

        mockMvc.perform(get("/api/v1/admin/recycling-activities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].material").value("plástico"));
    }

    @Test
    void approveRecyclingActivity_Returns200() throws Exception {
        RecyclingActivityEntity approved = buildActivity();
        approved.setStatus(RecyclingActivityStatus.APPROVED);
        approved.setReviewedBy("admin@ecoland.com");

        when(recyclingActivityService.approveActivity(eq(1L), anyString())).thenReturn(approved);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "admin@ecoland.com", null, Collections.emptyList());

        mockMvc.perform(post("/api/v1/admin/recycling-activities/1/approve").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    void rejectRecyclingActivity_Returns200() throws Exception {
        RecyclingActivityEntity rejected = buildActivity();
        rejected.setStatus(RecyclingActivityStatus.REJECTED);
        rejected.setAdminNotes("Material incorrecto");

        when(recyclingActivityService.rejectActivity(eq(1L), anyString(), anyString())).thenReturn(rejected);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "admin@ecoland.com", null, Collections.emptyList());

        mockMvc.perform(post("/api/v1/admin/recycling-activities/1/reject")
                        .param("adminNotes", "Material incorrecto")
                        .principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));
    }
}
