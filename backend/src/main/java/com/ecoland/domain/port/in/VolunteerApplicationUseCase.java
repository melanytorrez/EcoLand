package com.ecoland.domain.port.in;

import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.model.VolunteerStatus;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada para el caso de uso de postulación al voluntariado.
 * HU6-03: Permite al usuario postularse.
 * HU6-04: El sistema valida, almacena y gestiona el estado de postulaciones.
 */
public interface VolunteerApplicationUseCase {

    /**
     * Registra una nueva postulación de voluntariado.
     * Valida que el usuario no haya postulado antes y que haya cupos disponibles.
     */
    VolunteerApplication apply(VolunteerApplication application);

    /**
     * Obtiene todas las postulaciones para una campaña específica (uso admin).
     */
    List<VolunteerApplication> getApplicationsByCampaign(Long campaignId);

    /**
     * Obtiene postulaciones por estado, usado por el panel admin.
     */
    List<VolunteerApplication> getApplicationsByStatus(VolunteerStatus status);

    /**
     * Verifica si un usuario ya postuló a una campaña específica.
     */
    Optional<VolunteerApplication> getMyApplication(Long campaignId, String email);

    /**
     * Aprueba una postulación (solo admin). Incrementa el contador de participantes.
     */
    VolunteerApplication approveApplication(Long applicationId);

    /**
     * Rechaza una postulación (solo admin).
     */
    VolunteerApplication rejectApplication(Long applicationId, String adminNotes);
}
