package com.ecoland.infrastructure.entity;

import com.ecoland.domain.model.VolunteerStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad JPA para la tabla volunteer_applications.
 * Almacena las postulaciones de voluntariado de los usuarios (HU6-04).
 */
@Entity
@Table(name = "volunteer_applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_email", "campaign_id"})
})
public class VolunteerApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "usuario_email", nullable = false)
    private String usuarioEmail;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "available_weekends", nullable = false)
    private Boolean availableWeekends;

    @Column(name = "has_environmental_experience", nullable = false)
    private Boolean hasEnvironmentalExperience;

    @Column(name = "experience_details", columnDefinition = "TEXT")
    private String experienceDetails;

    @Column(name = "motivation", columnDefinition = "TEXT", nullable = false)
    private String motivation;

    @Column(name = "availability_hours")
    private String availabilityHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VolunteerStatus status;

    @Column(name = "fecha_postulacion")
    private LocalDateTime fechaPostulacion;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    public VolunteerApplicationEntity() {}

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
