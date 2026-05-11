package com.ecoland.infrastructure.entity;

import com.ecoland.domain.model.EstadoSolicitud;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "usuarios")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "usuario_roles",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private Set<RolEntity> roles;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_solicitud")
    private EstadoSolicitud estadoSolicitud = EstadoSolicitud.NONE;

    @Column(columnDefinition = "TEXT")
    private String motivation;

    @Column(columnDefinition = "TEXT")
    private String plans;

    @Column(columnDefinition = "TEXT")
    private String experience;

    private String commitment;
    private String contact;
    private String zone;
    private String organization;

    @Column(name = "fecha_solicitud")
    private java.time.LocalDateTime fechaSolicitud;

    public UsuarioEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<RolEntity> getRoles() { return roles; }
    public void setRoles(Set<RolEntity> roles) { this.roles = roles; }

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
