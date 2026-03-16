package com.ecoland.domain.model;

import java.time.LocalDateTime;

public class TokenSesion {
    private Long id;
    private String token;
    private LocalDateTime fechaExpiracion;
    private Long usuarioId;

    public TokenSesion() {}

    public TokenSesion(Long id, String token, LocalDateTime fechaExpiracion, Long usuarioId) {
        this.id = id;
        this.token = token;
        this.fechaExpiracion = fechaExpiracion;
        this.usuarioId = usuarioId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public LocalDateTime getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDateTime fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
