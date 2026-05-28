package com.ecoland.application.dto;

import com.ecoland.domain.model.EstadoSolicitud;
import com.ecoland.domain.model.Usuario;

/**
 * DTO de respuesta para datos de usuario.
 * Expone 'role' como String en lugar de Set<Rol> para compatibilidad con el frontend Angular.
 */
public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String email;
    private String role;
    private EstadoSolicitud estadoSolicitud;
    private String motivation;
    private String plans;
    private String experience;
    private String commitment;
    private String contact;
    private String zone;
    private String organization;
    private java.time.LocalDateTime fechaSolicitud;

    public UsuarioResponse() {}

    public static UsuarioResponse fromUsuario(Usuario u) {
        UsuarioResponse dto = new UsuarioResponse();
        dto.id = u.getId();
        dto.nombre = u.getNombre();
        dto.email = u.getEmail();
        dto.estadoSolicitud = u.getEstadoSolicitud();
        dto.motivation = u.getMotivation();
        dto.plans = u.getPlans();
        dto.experience = u.getExperience();
        dto.commitment = u.getCommitment();
        dto.contact = u.getContact();
        dto.zone = u.getZone();
        dto.organization = u.getOrganization();
        dto.fechaSolicitud = u.getFechaSolicitud();

        // Resolver el rol principal como String para el frontend
        if (u.getRoles() != null && !u.getRoles().isEmpty()) {
            String resolved = u.getRoles().stream()
                    .map(r -> r.getNombre())
                    .filter(n -> n != null && !n.isBlank())
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .findFirst()
                    .orElse("USUARIO");

            if (resolved.contains("ADMIN")) {
                dto.role = "ADMINISTRADOR";
            } else if (resolved.contains("LIDER") || resolved.contains("LEADER")) {
                dto.role = "LIDER";
            } else {
                dto.role = "USUARIO";
            }
        } else {
            dto.role = "USUARIO";
        }

        return dto;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public EstadoSolicitud getEstadoSolicitud() { return estadoSolicitud; }
    public String getMotivation() { return motivation; }
    public String getPlans() { return plans; }
    public String getExperience() { return experience; }
    public String getCommitment() { return commitment; }
    public String getContact() { return contact; }
    public String getZone() { return zone; }
    public String getOrganization() { return organization; }
    public java.time.LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
}
