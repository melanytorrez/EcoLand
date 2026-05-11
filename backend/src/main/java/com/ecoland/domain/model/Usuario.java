package com.ecoland.domain.model;

import java.util.Set;

public class Usuario {
    private Long id;
    private String nombre;
    private String email;
    private String password;
    private Set<Rol> roles;
    private EstadoSolicitud estadoSolicitud = EstadoSolicitud.NONE;
    private String motivation;
    private String plans;
    private String experience;
    private String commitment;
    private String contact;
    private String zone;
    private String organization;
    private java.time.LocalDateTime fechaSolicitud;

    public Usuario() {}

    public Usuario(Long id, String nombre, String email, String password, Set<Rol> roles, EstadoSolicitud estadoSolicitud) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.estadoSolicitud = estadoSolicitud;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<Rol> getRoles() { return roles; }
    public void setRoles(Set<Rol> roles) { this.roles = roles; }

    public EstadoSolicitud getEstadoSolicitud() { return estadoSolicitud; }
    public void setEstadoSolicitud(EstadoSolicitud estadoSolicitud) { this.estadoSolicitud = estadoSolicitud; }

    public String getMotivation() { return motivation; }
    public void setMotivation(String motivation) { this.motivation = motivation; }

    public String getPlans() { return plans; }
    public void setPlans(String plans) { this.plans = plans; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getCommitment() { return commitment; }
    public void setCommitment(String commitment) { this.commitment = commitment; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public java.time.LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(java.time.LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
}
