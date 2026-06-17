package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.model.CampaignCategory;
import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.model.VolunteerStatus;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.domain.port.out.VolunteerApplicationRepositoryPort;
import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VolunteerApplicationServiceTest {

    @Mock private VolunteerApplicationRepositoryPort volunteerApplicationRepositoryPort;
    @Mock private CampaignRepositoryPort campaignRepositoryPort;
    @Mock private JpaUsuarioCampaignRepository usuarioCampaignRepository;
    @Mock private BadgeService badgeService;

    @InjectMocks
    private VolunteerApplicationService volunteerApplicationService;

    private static final String EMAIL = "voluntario@ecoland.com";
    private Campaign campaignReforestacion;

    @BeforeEach
    void setUp() {
        campaignReforestacion = new Campaign();
        campaignReforestacion.setId(1L);
        campaignReforestacion.setTitle("Campaña Reforestación");
        campaignReforestacion.setCategory(CampaignCategory.REFORESTATION);
        campaignReforestacion.setSpots(50);
        campaignReforestacion.setParticipants(10);
    }

    private VolunteerApplication buildApplication() {
        VolunteerApplication app = new VolunteerApplication();
        app.setCampaignId(1L);
        app.setUsuarioEmail(EMAIL);
        app.setFullName("Juan Voluntario");
        app.setAge(25);
        app.setPhone("71234567");
        app.setAvailableWeekends(true);
        app.setHasEnvironmentalExperience(false);
        app.setMotivation("Quiero ayudar al medio ambiente");
        app.setAvailabilityHours("Mañanas");
        return app;
    }

    // --- apply ---

    @Test
    void apply_Success_ForReforestationCampaignWithAvailableSpots() {
        VolunteerApplication app = buildApplication();
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaignReforestacion));
        when(volunteerApplicationRepositoryPort.existsByEmailAndCampaignId(EMAIL, 1L)).thenReturn(false);
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(EMAIL, 1L)).thenReturn(false);
        when(volunteerApplicationRepositoryPort.save(any())).thenAnswer(inv -> inv.getArgument(0));

        VolunteerApplication result = volunteerApplicationService.apply(app);

        assertNotNull(result);
        assertEquals(VolunteerStatus.PENDING, result.getStatus());
        assertNotNull(result.getFechaPostulacion());
        assertNull(result.getAdminNotes());
        verify(volunteerApplicationRepositoryPort).save(app);
    }

    @Test
    void apply_ThrowsIllegalState_WhenCampaignIsNotReforestation() {
        Campaign reciclaje = new Campaign();
        reciclaje.setId(2L);
        reciclaje.setCategory(CampaignCategory.RECYCLING);
        reciclaje.setSpots(20);
        reciclaje.setParticipants(0);

        VolunteerApplication app = buildApplication();
        app.setCampaignId(2L);
        when(campaignRepositoryPort.findById(2L)).thenReturn(Optional.of(reciclaje));

        assertThrows(IllegalStateException.class, () -> volunteerApplicationService.apply(app));
    }

    @Test
    void apply_ThrowsIllegalState_WhenDuplicateApplication() {
        VolunteerApplication app = buildApplication();
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaignReforestacion));
        when(volunteerApplicationRepositoryPort.existsByEmailAndCampaignId(EMAIL, 1L)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> volunteerApplicationService.apply(app));
    }

    @Test
    void apply_ThrowsIllegalState_WhenAlreadyEnrolledInCampaign() {
        VolunteerApplication app = buildApplication();
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaignReforestacion));
        when(volunteerApplicationRepositoryPort.existsByEmailAndCampaignId(EMAIL, 1L)).thenReturn(false);
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(EMAIL, 1L)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> volunteerApplicationService.apply(app));
    }

    @Test
    void apply_ThrowsIllegalState_WhenNoSpotsAvailable() {
        campaignReforestacion.setParticipants(50);

        VolunteerApplication app = buildApplication();
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaignReforestacion));
        when(volunteerApplicationRepositoryPort.existsByEmailAndCampaignId(EMAIL, 1L)).thenReturn(false);
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(EMAIL, 1L)).thenReturn(false);

        assertThrows(IllegalStateException.class, () -> volunteerApplicationService.apply(app));
    }

    @Test
    void apply_ThrowsNoSuchElement_WhenCampaignNotFound() {
        VolunteerApplication app = buildApplication();
        app.setCampaignId(99L);
        when(campaignRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> volunteerApplicationService.apply(app));
    }

    // --- approveApplication ---

    @Test
    void approveApplication_Success_EnrollsUserAndIncreasesParticipants() {
        VolunteerApplication app = buildApplication();
        app.setId(10L);
        app.setStatus(VolunteerStatus.PENDING);

        when(volunteerApplicationRepositoryPort.findById(10L)).thenReturn(Optional.of(app));
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaignReforestacion));
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(EMAIL, 1L)).thenReturn(false);
        when(volunteerApplicationRepositoryPort.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(usuarioCampaignRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        VolunteerApplication result = volunteerApplicationService.approveApplication(10L);

        assertEquals(VolunteerStatus.ACCEPTED, result.getStatus());
        verify(usuarioCampaignRepository).save(any(UsuarioCampaignEntity.class));
        verify(campaignRepositoryPort).save(argThat(c -> c.getParticipants() == 11));
        verify(badgeService).evaluateAndAssignBadges(EMAIL);
    }

    @Test
    void approveApplication_ThrowsIllegalState_WhenApplicationNotPending() {
        VolunteerApplication app = buildApplication();
        app.setId(10L);
        app.setStatus(VolunteerStatus.ACCEPTED);

        when(volunteerApplicationRepositoryPort.findById(10L)).thenReturn(Optional.of(app));

        assertThrows(IllegalStateException.class, () -> volunteerApplicationService.approveApplication(10L));
    }

    @Test
    void approveApplication_ThrowsIllegalState_WhenNoSpotsLeft() {
        campaignReforestacion.setParticipants(50);

        VolunteerApplication app = buildApplication();
        app.setId(10L);
        app.setStatus(VolunteerStatus.PENDING);

        when(volunteerApplicationRepositoryPort.findById(10L)).thenReturn(Optional.of(app));
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaignReforestacion));

        assertThrows(IllegalStateException.class, () -> volunteerApplicationService.approveApplication(10L));
    }

    @Test
    void approveApplication_ThrowsNoSuchElement_WhenApplicationNotFound() {
        when(volunteerApplicationRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> volunteerApplicationService.approveApplication(99L));
    }

    @Test
    void approveApplication_DoesNotDuplicateEnrollment_WhenAlreadyRegistered() {
        VolunteerApplication app = buildApplication();
        app.setId(10L);
        app.setStatus(VolunteerStatus.PENDING);

        when(volunteerApplicationRepositoryPort.findById(10L)).thenReturn(Optional.of(app));
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(campaignReforestacion));
        when(usuarioCampaignRepository.existsByUsuarioEmailAndCampaignId(EMAIL, 1L)).thenReturn(true);
        when(volunteerApplicationRepositoryPort.save(any())).thenAnswer(inv -> inv.getArgument(0));

        volunteerApplicationService.approveApplication(10L);

        verify(usuarioCampaignRepository, never()).save(any(UsuarioCampaignEntity.class));
        verify(campaignRepositoryPort, never()).save(any());
    }

    // --- rejectApplication ---

    @Test
    void rejectApplication_Success_SetsStatusAndAdminNotes() {
        VolunteerApplication app = buildApplication();
        app.setId(11L);
        app.setStatus(VolunteerStatus.PENDING);

        when(volunteerApplicationRepositoryPort.findById(11L)).thenReturn(Optional.of(app));
        when(volunteerApplicationRepositoryPort.save(any())).thenAnswer(inv -> inv.getArgument(0));

        VolunteerApplication result = volunteerApplicationService.rejectApplication(11L, "No cumple los requisitos");

        assertEquals(VolunteerStatus.REJECTED, result.getStatus());
        assertEquals("No cumple los requisitos", result.getAdminNotes());
        verify(badgeService, never()).evaluateAndAssignBadges(any());
    }

    @Test
    void rejectApplication_ThrowsIllegalState_WhenApplicationNotPending() {
        VolunteerApplication app = buildApplication();
        app.setId(11L);
        app.setStatus(VolunteerStatus.REJECTED);

        when(volunteerApplicationRepositoryPort.findById(11L)).thenReturn(Optional.of(app));

        assertThrows(IllegalStateException.class,
                () -> volunteerApplicationService.rejectApplication(11L, "notas"));
    }

    // --- getApplicationsByCampaign ---

    @Test
    void getApplicationsByCampaign_ReturnsList() {
        VolunteerApplication app = buildApplication();
        when(volunteerApplicationRepositoryPort.findByCampaignId(1L)).thenReturn(List.of(app));

        List<VolunteerApplication> result = volunteerApplicationService.getApplicationsByCampaign(1L);

        assertEquals(1, result.size());
        verify(volunteerApplicationRepositoryPort).findByCampaignId(1L);
    }

    // --- getApplicationsByStatus ---

    @Test
    void getApplicationsByStatus_ReturnsList() {
        VolunteerApplication app = buildApplication();
        app.setStatus(VolunteerStatus.PENDING);
        when(volunteerApplicationRepositoryPort.findByStatus(VolunteerStatus.PENDING)).thenReturn(List.of(app));

        List<VolunteerApplication> result = volunteerApplicationService.getApplicationsByStatus(VolunteerStatus.PENDING);

        assertEquals(1, result.size());
    }

    // --- getMyApplication ---

    @Test
    void getMyApplication_ReturnsOptional_WhenExists() {
        VolunteerApplication app = buildApplication();
        when(volunteerApplicationRepositoryPort.findByEmailAndCampaignId(EMAIL, 1L))
                .thenReturn(Optional.of(app));

        Optional<VolunteerApplication> result = volunteerApplicationService.getMyApplication(1L, EMAIL);

        assertTrue(result.isPresent());
    }

    @Test
    void getMyApplication_ReturnsEmpty_WhenNotExists() {
        when(volunteerApplicationRepositoryPort.findByEmailAndCampaignId(EMAIL, 1L))
                .thenReturn(Optional.empty());

        Optional<VolunteerApplication> result = volunteerApplicationService.getMyApplication(1L, EMAIL);

        assertTrue(result.isEmpty());
    }
}
