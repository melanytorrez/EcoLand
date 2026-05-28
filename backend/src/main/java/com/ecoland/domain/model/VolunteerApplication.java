package com.ecoland.domain.model;

import java.time.LocalDateTime;

/**
 * Modelo de dominio para una postulación al voluntariado de reforestación.
 * HU6-03: El usuario completa un formulario para demostrar que cumple las condiciones de participación.
 * HU6-04: El sistema valida y almacena la postulación con su estado de elegibilidad.
 */
public class VolunteerApplication {

    private Long id;

    // Relaciones
    private Long campaignId;
    private String usuarioEmail;

    // Datos del formulario (HU6-03)
    private String fullName;
    private Integer age;
    private String phone;
    private Boolean availableWeekends;
    private Boolean hasEnvironmentalExperience;
    private String experienceDetails;
    private String motivation;
    private String availabilityHours; // Ej: "Mañanas", "Tardes", "Todo el día"

    // Estado y auditoría (HU6-04)
    private VolunteerStatus status;
    private LocalDateTime fechaPostulacion;
    private String adminNotes; // Notas del administrador al aprobar/rechazar

    public VolunteerApplication() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

    public String getUsuarioEmail() { return usuarioEmail; }
    public void setUsuarioEmail(String usuarioEmail) { this.usuarioEmail = usuarioEmail; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getAvailableWeekends() { return availableWeekends; }
    public void setAvailableWeekends(Boolean availableWeekends) { this.availableWeekends = availableWeekends; }

    public Boolean getHasEnvironmentalExperience() { return hasEnvironmentalExperience; }
    public void setHasEnvironmentalExperience(Boolean hasEnvironmentalExperience) {
        this.hasEnvironmentalExperience = hasEnvironmentalExperience;
    }

    public String getExperienceDetails() { return experienceDetails; }
    public void setExperienceDetails(String experienceDetails) { this.experienceDetails = experienceDetails; }

    public String getMotivation() { return motivation; }
    public void setMotivation(String motivation) { this.motivation = motivation; }

    public String getAvailabilityHours() { return availabilityHours; }
    public void setAvailabilityHours(String availabilityHours) { this.availabilityHours = availabilityHours; }

    public VolunteerStatus getStatus() { return status; }
    public void setStatus(VolunteerStatus status) { this.status = status; }

    public LocalDateTime getFechaPostulacion() { return fechaPostulacion; }
    public void setFechaPostulacion(LocalDateTime fechaPostulacion) { this.fechaPostulacion = fechaPostulacion; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
