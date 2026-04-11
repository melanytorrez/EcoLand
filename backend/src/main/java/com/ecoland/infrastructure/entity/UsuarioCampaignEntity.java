package com.ecoland.infrastructure.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "usuario_campaigns", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_email", "campaign_id"})
})
public class UsuarioCampaignEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_email", nullable = false)
    private String usuarioEmail;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "fecha_inscripcion")
    private String fechaInscripcion;

    public UsuarioCampaignEntity() {
    }

    public UsuarioCampaignEntity(String usuarioEmail, Long campaignId, String fechaInscripcion) {
        this.usuarioEmail = usuarioEmail;
        this.campaignId = campaignId;
        this.fechaInscripcion = fechaInscripcion;
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

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getFechaInscripcion() {
        return fechaInscripcion;
    }

    public void setFechaInscripcion(String fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }
}
