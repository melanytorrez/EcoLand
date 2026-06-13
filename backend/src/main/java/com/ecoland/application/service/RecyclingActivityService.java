package com.ecoland.application.service;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.domain.port.out.PuntoVerdeRepositoryPort;
import com.ecoland.infrastructure.entity.RecyclingActivityEntity;
import com.ecoland.infrastructure.repository.JpaRecyclingActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

@Service
@Transactional
public class RecyclingActivityService {

    private final JpaRecyclingActivityRepository recyclingActivityRepository;
    private final PuntoVerdeRepositoryPort puntoVerdeRepositoryPort;
    private final BadgeService badgeService;

    public RecyclingActivityService(JpaRecyclingActivityRepository recyclingActivityRepository,
                                    PuntoVerdeRepositoryPort puntoVerdeRepositoryPort,
                                    BadgeService badgeService) {
        this.recyclingActivityRepository = recyclingActivityRepository;
        this.puntoVerdeRepositoryPort = puntoVerdeRepositoryPort;
        this.badgeService = badgeService;
    }

    public RecyclingActivityEntity registerActivity(String usuarioEmail,
                                                    Long puntoVerdeId,
                                                    String material,
                                                    String cantidad,
                                                    String unidad,
                                                    String comentario) {
        PuntoVerde puntoVerde = puntoVerdeRepositoryPort.findById(puntoVerdeId)
                .orElseThrow(() -> new NoSuchElementException("No se encontro el punto verde con id " + puntoVerdeId));

        if (!puntoVerde.isActivo()) {
            throw new IllegalStateException("Solo puedes registrar reciclaje en puntos verdes activos");
        }

        String normalizedMaterial = normalizeRequired(material, "El material reciclado es obligatorio");
        boolean materialAllowed = puntoVerde.getTiposMaterial() != null && puntoVerde.getTiposMaterial().stream()
                .anyMatch(allowed -> normalize(allowed).equals(normalizedMaterial));

        if (!materialAllowed) {
            throw new IllegalStateException("El material seleccionado no esta permitido en este punto verde");
        }

        RecyclingActivityEntity activity = new RecyclingActivityEntity();
        activity.setUsuarioEmail(usuarioEmail);
        activity.setPuntoVerdeId(puntoVerde.getId());
        activity.setPuntoVerdeNombre(puntoVerde.getNombre());
        activity.setMaterial(material.trim());
        activity.setCantidad(cleanOptional(cantidad));
        activity.setUnidad(cleanOptional(unidad));
        activity.setComentario(cleanOptional(comentario));
        activity.setStatus(RecyclingActivityStatus.PENDING);
        activity.setRegisteredAt(LocalDateTime.now());

        return recyclingActivityRepository.save(activity);
    }

    @Transactional(readOnly = true)
    public List<RecyclingActivityEntity> getActivitiesByStatus(RecyclingActivityStatus status) {
        return recyclingActivityRepository.findByStatusOrderByRegisteredAtDesc(status);
    }

    @Transactional(readOnly = true)
    public List<RecyclingActivityEntity> getMyActivities(String usuarioEmail) {
        return recyclingActivityRepository.findByUsuarioEmailOrderByRegisteredAtDesc(usuarioEmail);
    }

    public RecyclingActivityEntity approveActivity(Long activityId, String reviewedBy) {
        RecyclingActivityEntity activity = getPendingActivity(activityId);
        activity.setStatus(RecyclingActivityStatus.APPROVED);
        activity.setReviewedAt(LocalDateTime.now());
        activity.setReviewedBy(reviewedBy);
        RecyclingActivityEntity saved = recyclingActivityRepository.save(activity);

        badgeService.evaluateAndAssignBadges(saved.getUsuarioEmail());

        return saved;
    }

    public RecyclingActivityEntity rejectActivity(Long activityId, String reviewedBy, String adminNotes) {
        RecyclingActivityEntity activity = getPendingActivity(activityId);
        activity.setStatus(RecyclingActivityStatus.REJECTED);
        activity.setAdminNotes(cleanOptional(adminNotes));
        activity.setReviewedAt(LocalDateTime.now());
        activity.setReviewedBy(reviewedBy);
        return recyclingActivityRepository.save(activity);
    }

    private RecyclingActivityEntity getPendingActivity(Long activityId) {
        RecyclingActivityEntity activity = recyclingActivityRepository.findById(activityId)
                .orElseThrow(() -> new NoSuchElementException("No se encontro la actividad de reciclaje con id " + activityId));

        if (activity.getStatus() != RecyclingActivityStatus.PENDING) {
            throw new IllegalStateException("Solo se pueden revisar actividades pendientes");
        }

        return activity;
    }

    private String normalizeRequired(String value, String errorMessage) {
        if (value == null || value.trim().isBlank()) {
            throw new IllegalStateException(errorMessage);
        }
        return normalize(value);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private String cleanOptional(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
