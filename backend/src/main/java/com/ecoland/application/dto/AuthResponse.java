package com.ecoland.application.dto;

public class AuthResponse {

    private String token;
    private String email;
    private String nombre;
    private String role;
    private Long id;

    public AuthResponse(String token, String email, String nombre, String role) {
        this.token = token;
        this.email = email;
        this.nombre = nombre;
        this.role = role;
    }

    public AuthResponse(String token, String email, String nombre, String role, Long id) {
        this.token = token;
        this.email = email;
        this.nombre = nombre;
        this.role = role;
        this.id = id;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getNombre() { return nombre; }
    public String getRole() { return role; }
    public Long getId() { return id; }
}