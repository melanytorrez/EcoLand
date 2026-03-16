package com.ecoland.domain.model;

import java.time.LocalDateTime;

public class TokenSesion {
    private Long id;
    private String token;
    private LocalDateTime fechaExpiracion;
    private Usuario usuario;

    public TokenSesion() {}

    public TokenSesion(Long id, String token, LocalDateTime fechaExpiracion, Usuario usuario) {
        this.id = id;
        this.token = token;
        this.fechaExpiracion = fechaExpiracion;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public LocalDateTime getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDateTime fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
