package com.ecoland.application.service;

import com.ecoland.application.dto.UserBadgeSummaryResponse;
import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.model.CampaignCategory;
import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.entity.UserBadgeEntity;
import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import com.ecoland.infrastructure.repository.JpaRecyclingActivityRepository;
import com.ecoland.infrastructure.repository.JpaUserBadgeRepository;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BadgeServiceTest {

    @Mock private JpaUserBadgeRepository userBadgeRepository;
    @Mock private JpaUsuarioCampaignRepository usuarioCampaignRepository;
    @Mock private JpaRecyclingActivityRepository recyclingActivityRepository;
    @Mock private CampaignRepositoryPort campaignRepositoryPort;

    @InjectMocks
    private BadgeService badgeService;

    private static final String EMAIL = "eco@test.com";

    private UsuarioCampaignEntity buildRelacion(Long campaignId) {
        UsuarioCampaignEntity e = new UsuarioCampaignEntity();
        e.setCampaignId(campaignId);
        e.setUsuarioEmail(EMAIL);
        return e;
    }

    private Campaign buildCampaign(Long id, CampaignCategory category) {
        Campaign c = new Campaign();
        c.setId(id);
        c.setCategory(category);
        return c;
    }

    @BeforeEach
    void setUp() {
        // por defecto ninguna badge existe y no hay actividades de reciclaje
        when(userBadgeRepository.existsByUsuarioEmailAndBadgeCode(anyString(), anyString())).thenReturn(false);
        when(recyclingActivityRepository.countByUsuarioEmailAndStatus(anyString(), any())).thenReturn(0L);
        when(usuarioCampaignRepository.findByUsuarioEmail(anyString())).thenReturn(Collections.emptyList());
        when(userBadgeRepository.findByUsuarioEmailOrderByEarnedAtAsc(anyString())).thenReturn(Collections.emptyList());
    }

    // --- evaluateAndAssignBadges ---

    @Test
    void evaluateAndAssignBadges_AssignsRef1_WhenOneReforestationCampaign() {
        UsuarioCampaignEntity relacion = buildRelacion(1L);
        Campaign camp = buildCampaign(1L, CampaignCategory.REFORESTATION);

        when(usuarioCampaignRepository.findByUsuarioEmail(EMAIL)).thenReturn(List.of(relacion));
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(camp));

        badgeService.evaluateAndAssignBadges(EMAIL);

        verify(userBadgeRepository, atLeastOnce()).save(argThat(b -> b.getBadgeCode().equals("ref_1")));
    }

    @Test
    void evaluateAndAssignBadges_AssignsRef5_WhenFiveReforestationCampaigns() {
        List<UsuarioCampaignEntity> relaciones = List.of(
                buildRelacion(1L), buildRelacion(2L), buildRelacion(3L), buildRelacion(4L), buildRelacion(5L));
        List<Campaign> camps = List.of(
                buildCampaign(1L, CampaignCategory.REFORESTATION),
                buildCampaign(2L, CampaignCategory.REFORESTATION),
                buildCampaign(3L, CampaignCategory.REFORESTATION),
                buildCampaign(4L, CampaignCategory.REFORESTATION),
                buildCampaign(5L, CampaignCategory.REFORESTATION));

        when(usuarioCampaignRepository.findByUsuarioEmail(EMAIL)).thenReturn(relaciones);
        for (int i = 0; i < camps.size(); i++) {
            when(campaignRepositoryPort.findById((long) (i + 1))).thenReturn(Optional.of(camps.get(i)));
        }

        badgeService.evaluateAndAssignBadges(EMAIL);

        verify(userBadgeRepository, atLeastOnce()).save(argThat(b -> b.getBadgeCode().equals("ref_5")));
    }

    @Test
    void evaluateAndAssignBadges_AssignsRec1_WhenOneApprovedRecyclingActivity() {
        when(recyclingActivityRepository.countByUsuarioEmailAndStatus(EMAIL, RecyclingActivityStatus.APPROVED))
                .thenReturn(1L);

        badgeService.evaluateAndAssignBadges(EMAIL);

        verify(userBadgeRepository, atLeastOnce()).save(argThat(b -> b.getBadgeCode().equals("rec_1")));
    }

    @Test
    void evaluateAndAssignBadges_AssignsRec5_WhenFiveApprovedRecyclingActivities() {
        when(recyclingActivityRepository.countByUsuarioEmailAndStatus(EMAIL, RecyclingActivityStatus.APPROVED))
                .thenReturn(5L);

        badgeService.evaluateAndAssignBadges(EMAIL);

        verify(userBadgeRepository, atLeastOnce()).save(argThat(b -> b.getBadgeCode().equals("rec_5")));
    }

    @Test
    void evaluateAndAssignBadges_AssignsGen10_WhenTenTotalActivities() {
        // 5 campañas de reforestación + 5 actividades de reciclaje = 10 total
        List<UsuarioCampaignEntity> relaciones = List.of(
                buildRelacion(1L), buildRelacion(2L), buildRelacion(3L), buildRelacion(4L), buildRelacion(5L));

        when(usuarioCampaignRepository.findByUsuarioEmail(EMAIL)).thenReturn(relaciones);
        for (int i = 1; i <= 5; i++) {
            when(campaignRepositoryPort.findById((long) i)).thenReturn(
                    Optional.of(buildCampaign((long) i, CampaignCategory.REFORESTATION)));
        }
        when(recyclingActivityRepository.countByUsuarioEmailAndStatus(EMAIL, RecyclingActivityStatus.APPROVED))
                .thenReturn(5L);

        badgeService.evaluateAndAssignBadges(EMAIL);

        verify(userBadgeRepository, atLeastOnce()).save(argThat(b -> b.getBadgeCode().equals("gen_10")));
    }

    @Test
    void evaluateAndAssignBadges_DoesNotDuplicate_WhenBadgeAlreadyExists() {
        when(recyclingActivityRepository.countByUsuarioEmailAndStatus(EMAIL, RecyclingActivityStatus.APPROVED))
                .thenReturn(1L);
        when(userBadgeRepository.existsByUsuarioEmailAndBadgeCode(EMAIL, "rec_1")).thenReturn(true);

        badgeService.evaluateAndAssignBadges(EMAIL);

        verify(userBadgeRepository, never()).save(argThat(b -> b.getBadgeCode().equals("rec_1")));
    }

    @Test
    void evaluateAndAssignBadges_DoesNotAssign_WhenThresholdNotReached() {
        // sin campaña ni actividad aprobada
        badgeService.evaluateAndAssignBadges(EMAIL);

        verify(userBadgeRepository, never()).save(any());
    }

    // --- getBadgeSummary ---

    @Test
    void getBadgeSummary_ReturnsEarnedBadgesAndProgress() {
        UserBadgeEntity badge = new UserBadgeEntity(EMAIL, "ref_1", "reforestacion", "tree-pine", LocalDateTime.now());
        when(userBadgeRepository.findByUsuarioEmailOrderByEarnedAtAsc(EMAIL)).thenReturn(List.of(badge));
        when(userBadgeRepository.existsByUsuarioEmailAndBadgeCode(EMAIL, "ref_1")).thenReturn(true);

        UserBadgeSummaryResponse summary = badgeService.getBadgeSummary(EMAIL);

        assertNotNull(summary);
        assertEquals(1, summary.getEarnedBadges().size());
        assertEquals("ref_1", summary.getEarnedBadges().get(0).getCode());
        assertEquals(5, summary.getProgress().size());
    }

    @Test
    void getBadgeSummary_ProgressPercentage_IsCorrect() {
        UsuarioCampaignEntity relacion = buildRelacion(1L);
        Campaign camp = buildCampaign(1L, CampaignCategory.REFORESTATION);
        when(usuarioCampaignRepository.findByUsuarioEmail(EMAIL)).thenReturn(List.of(relacion));
        when(campaignRepositoryPort.findById(1L)).thenReturn(Optional.of(camp));
        when(userBadgeRepository.findByUsuarioEmailOrderByEarnedAtAsc(EMAIL)).thenReturn(Collections.emptyList());

        UserBadgeSummaryResponse summary = badgeService.getBadgeSummary(EMAIL);

        // ref_1 tiene target=1, con 1 reforestation → 100%
        var ref1Progress = summary.getProgress().stream()
                .filter(p -> p.getCode().equals("ref_1"))
                .findFirst()
                .orElseThrow();
        assertEquals(100, ref1Progress.getPercentage());
        assertEquals(1, ref1Progress.getCurrent());
    }

    @Test
    void getBadgeSummary_EmptyWhenNoActivities() {
        UserBadgeSummaryResponse summary = badgeService.getBadgeSummary(EMAIL);

        assertNotNull(summary);
        assertTrue(summary.getEarnedBadges().isEmpty());
        assertEquals(5, summary.getProgress().size());
        summary.getProgress().forEach(p -> assertEquals(0, p.getCurrent()));
    }
}
