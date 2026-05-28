package com.ecoland.domain.model;

/**
 * Estado de una postulación al voluntariado de reforestación.
 * HU6-04: El sistema acepta solo participantes elegibles y mantiene evidencia del registro.
 */
public enum VolunteerStatus {
    PENDING,   // Postulación recibida, pendiente de revisión por el administrador
    ACCEPTED,  // Postulación aprobada por el administrador
    REJECTED   // Postulación rechazada por el administrador
}
