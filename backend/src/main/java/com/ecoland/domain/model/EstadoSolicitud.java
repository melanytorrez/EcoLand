package com.ecoland.domain.model;

/**
 * Representa los posibles estados de una solicitud de un usuario para convertirse en Líder.
 */
public enum EstadoSolicitud {
    NONE,       // El usuario no ha solicitado ser líder
    PENDING,    // La solicitud está pendiente de aprobación por el Administrador
    APPROVED,   // La solicitud ha sido aprobada
    REJECTED    // La solicitud ha sido rechazada (opcional para futuras mejoras)
}
