package com.ecoland.domain.model;

import java.time.LocalDateTime;

public class AuditoriaLog {

    private Long id;
    private String usuarioEmail;
    private String accion;
    private String detalle;
    private LocalDateTime fecha;
    private Usuario usuario;

    public AuditoriaLog() {}

    public AuditoriaLog(Long id, String usuarioEmail, String accion, String detalle, LocalDateTime fecha, Usuario usuario) {
        this.id = id;
        this.usuarioEmail = usuarioEmail;
        this.accion = accion;
        this.detalle = detalle;
        this.fecha = fecha;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsuarioEmail() { return usuarioEmail; }
    public void setUsuarioEmail(String usuarioEmail) { this.usuarioEmail = usuarioEmail; }

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}