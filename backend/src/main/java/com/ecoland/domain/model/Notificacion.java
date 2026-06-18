package com.ecoland.domain.model;

import java.time.LocalDateTime;

public class Notificacion {
    private Long id;
    private String usuarioEmail;
    private String mensaje;
    private boolean leido;
    private LocalDateTime fechaCreacion;

    public Notificacion() {}

    public Notificacion(Long id, String usuarioEmail, String mensaje, boolean leido, LocalDateTime fechaCreacion) {
        this.id = id;
        this.usuarioEmail = usuarioEmail;
        this.mensaje = mensaje;
        this.leido = leido;
        this.fechaCreacion = fechaCreacion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public boolean isLeido() {
        return leido;
    }

    public void setLeido(boolean leido) {
        this.leido = leido;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
