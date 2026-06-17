package com.ecoland.application.service;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.domain.port.out.PuntoVerdeRepositoryPort;
import com.ecoland.infrastructure.entity.RecyclingActivityEntity;
import com.ecoland.infrastructure.repository.JpaRecyclingActivityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecyclingActivityServiceTest {

    @Mock private JpaRecyclingActivityRepository recyclingActivityRepository;
    @Mock private PuntoVerdeRepositoryPort puntoVerdeRepositoryPort;
    @Mock private BadgeService badgeService;

    @InjectMocks
    private RecyclingActivityService recyclingActivityService;

    private static final String EMAIL = "user@ecoland.com";
    private PuntoVerde puntoVerdeActivo;

    @BeforeEach
    void setUp() {
        puntoVerdeActivo = new PuntoVerde();
        puntoVerdeActivo.setId(1L);
        puntoVerdeActivo.setNombre("Punto Verde Centro");
        puntoVerdeActivo.setEstado("abierto");
        puntoVerdeActivo.setTiposMaterial(List.of("plástico", "vidrio", "papel"));
    }

    private RecyclingActivityEntity buildEntity(Long id, RecyclingActivityStatus status) {
        RecyclingActivityEntity e = new RecyclingActivityEntity();
        e.setId(id);
        e.setUsuarioEmail(EMAIL);
        e.setPuntoVerdeId(1L);
        e.setPuntoVerdeNombre("Punto Verde Centro");
        e.setMaterial("plástico");
        e.setStatus(status);
        e.setRegisteredAt(LocalDateTime.now());
        return e;
    }

    // --- registerActivity ---

    @Test
    void registerActivity_Success_WhenPuntoVerdeActivoAndMaterialAllowed() {
        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoVerdeActivo));
        when(recyclingActivityRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        RecyclingActivityEntity result = recyclingActivityService.registerActivity(
                EMAIL, 1L, "plástico", "2", "kg", "ninguno");

        assertNotNull(result);
        assertEquals(RecyclingActivityStatus.PENDING, result.getStatus());
        assertEquals(EMAIL, result.getUsuarioEmail());
        assertEquals("plástico", result.getMaterial());
        verify(recyclingActivityRepository).save(any());
    }

    @Test
    void registerActivity_ThrowsNoSuchElement_WhenPuntoVerdeNotFound() {
        when(puntoVerdeRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class,
                () -> recyclingActivityService.registerActivity(EMAIL, 99L, "plástico", "1", "kg", null));
    }

    @Test
    void registerActivity_ThrowsIllegalState_WhenPuntoVerdeInactivo() {
        puntoVerdeActivo.setEstado("cerrado");
        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoVerdeActivo));

        assertThrows(IllegalStateException.class,
                () -> recyclingActivityService.registerActivity(EMAIL, 1L, "plástico", "1", "kg", null));
    }

    @Test
    void registerActivity_ThrowsIllegalState_WhenMaterialNotAllowed() {
        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoVerdeActivo));

        assertThrows(IllegalStateException.class,
                () -> recyclingActivityService.registerActivity(EMAIL, 1L, "aceite", "1", "litro", null));
    }

    @Test
    void registerActivity_ThrowsIllegalState_WhenMaterialIsBlank() {
        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoVerdeActivo));

        assertThrows(IllegalStateException.class,
                () -> recyclingActivityService.registerActivity(EMAIL, 1L, "   ", "1", "kg", null));
    }

    @Test
    void registerActivity_AcceptsMaterialCaseInsensitive() {
        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoVerdeActivo));
        when(recyclingActivityRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        assertDoesNotThrow(() ->
                recyclingActivityService.registerActivity(EMAIL, 1L, "PLÁSTICO", "1", "kg", null));
    }

    @Test
    void registerActivity_SetsOptionalFieldsToNull_WhenBlank() {
        when(puntoVerdeRepositoryPort.findById(1L)).thenReturn(Optional.of(puntoVerdeActivo));
        when(recyclingActivityRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        RecyclingActivityEntity result = recyclingActivityService.registerActivity(
                EMAIL, 1L, "vidrio", "", "  ", null);

        assertNull(result.getCantidad());
        assertNull(result.getUnidad());
        assertNull(result.getComentario());
    }

    // --- approveActivity ---

    @Test
    void approveActivity_Success_UpdatesStatusAndCallsBadgeService() {
        RecyclingActivityEntity pending = buildEntity(5L, RecyclingActivityStatus.PENDING);
        when(recyclingActivityRepository.findById(5L)).thenReturn(Optional.of(pending));
        when(recyclingActivityRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        RecyclingActivityEntity result = recyclingActivityService.approveActivity(5L, "admin@ecoland.com");

        assertEquals(RecyclingActivityStatus.APPROVED, result.getStatus());
        assertEquals("admin@ecoland.com", result.getReviewedBy());
        assertNotNull(result.getReviewedAt());
        verify(badgeService).evaluateAndAssignBadges(EMAIL);
    }

    @Test
    void approveActivity_ThrowsNoSuchElement_WhenActivityNotFound() {
        when(recyclingActivityRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class,
                () -> recyclingActivityService.approveActivity(99L, "admin@ecoland.com"));
    }

    @Test
    void approveActivity_ThrowsIllegalState_WhenActivityNotPending() {
        RecyclingActivityEntity approved = buildEntity(5L, RecyclingActivityStatus.APPROVED);
        when(recyclingActivityRepository.findById(5L)).thenReturn(Optional.of(approved));

        assertThrows(IllegalStateException.class,
                () -> recyclingActivityService.approveActivity(5L, "admin@ecoland.com"));
    }

    // --- rejectActivity ---

    @Test
    void rejectActivity_Success_SetsStatusRejectedAndAdminNotes() {
        RecyclingActivityEntity pending = buildEntity(6L, RecyclingActivityStatus.PENDING);
        when(recyclingActivityRepository.findById(6L)).thenReturn(Optional.of(pending));
        when(recyclingActivityRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        RecyclingActivityEntity result = recyclingActivityService.rejectActivity(6L, "admin@ecoland.com", "Material incorrecto");

        assertEquals(RecyclingActivityStatus.REJECTED, result.getStatus());
        assertEquals("Material incorrecto", result.getAdminNotes());
        assertEquals("admin@ecoland.com", result.getReviewedBy());
        assertNotNull(result.getReviewedAt());
        verify(badgeService, never()).evaluateAndAssignBadges(any());
    }

    @Test
    void rejectActivity_ThrowsIllegalState_WhenActivityNotPending() {
        RecyclingActivityEntity rejected = buildEntity(7L, RecyclingActivityStatus.REJECTED);
        when(recyclingActivityRepository.findById(7L)).thenReturn(Optional.of(rejected));

        assertThrows(IllegalStateException.class,
                () -> recyclingActivityService.rejectActivity(7L, "admin@ecoland.com", "notas"));
    }

    @Test
    void rejectActivity_SetsAdminNotesToNull_WhenBlankNotes() {
        RecyclingActivityEntity pending = buildEntity(8L, RecyclingActivityStatus.PENDING);
        when(recyclingActivityRepository.findById(8L)).thenReturn(Optional.of(pending));
        when(recyclingActivityRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        RecyclingActivityEntity result = recyclingActivityService.rejectActivity(8L, "admin@ecoland.com", "  ");

        assertNull(result.getAdminNotes());
    }

    // --- getActivitiesByStatus ---

    @Test
    void getActivitiesByStatus_ReturnsList() {
        RecyclingActivityEntity e = buildEntity(1L, RecyclingActivityStatus.PENDING);
        when(recyclingActivityRepository.findByStatusOrderByRegisteredAtDesc(RecyclingActivityStatus.PENDING))
                .thenReturn(List.of(e));

        List<RecyclingActivityEntity> result = recyclingActivityService.getActivitiesByStatus(RecyclingActivityStatus.PENDING);

        assertEquals(1, result.size());
        assertEquals(RecyclingActivityStatus.PENDING, result.get(0).getStatus());
    }

    // --- getMyActivities ---

    @Test
    void getMyActivities_ReturnsList() {
        RecyclingActivityEntity e = buildEntity(1L, RecyclingActivityStatus.APPROVED);
        when(recyclingActivityRepository.findByUsuarioEmailOrderByRegisteredAtDesc(EMAIL))
                .thenReturn(List.of(e));

        List<RecyclingActivityEntity> result = recyclingActivityService.getMyActivities(EMAIL);

        assertEquals(1, result.size());
        assertEquals(EMAIL, result.get(0).getUsuarioEmail());
    }
}
