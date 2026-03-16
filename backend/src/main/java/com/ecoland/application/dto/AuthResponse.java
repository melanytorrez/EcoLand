package com.ecoland.application.dto;

public class AuthResponse {

    private String token;
    private String email;
    private String nombre;

    public AuthResponse(String token, String email, String nombre) {
        this.token = token;
        this.email = email;
        this.nombre = nombre;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getNombre() { return nombre; }
}