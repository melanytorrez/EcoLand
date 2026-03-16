package com.ecoland.domain.model;

import java.time.LocalDateTime;

public class AuditoriaLog {
    private Long id;
    private String accion;
    private String detalle;
    private LocalDateTime fecha;
    private Long usuarioId;

    public AuditoriaLog() {}

    public AuditoriaLog(Long id, String accion, String detalle, LocalDateTime fecha, Long usuarioId) {
        this.id = id;
        this.accion = accion;
        this.detalle = detalle;
        this.fecha = fecha;
        this.usuarioId = usuarioId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
