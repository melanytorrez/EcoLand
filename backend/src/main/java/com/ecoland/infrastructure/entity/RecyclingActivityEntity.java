package com.ecoland.infrastructure.entity;

import com.ecoland.domain.model.RecyclingActivityStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "recycling_activities")
public class RecyclingActivityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_email", nullable = false)
    private String usuarioEmail;

    @Column(name = "punto_verde_id", nullable = false)
    private Long puntoVerdeId;

    @Column(name = "punto_verde_nombre", nullable = false)
    private String puntoVerdeNombre;

    @Column(nullable = false)
    private String material;

    private String cantidad;

    private String unidad;

    @Column(length = 800)
    private String comentario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecyclingActivityStatus status;

    @Column(name = "admin_notes", length = 800)
    private String adminNotes;

    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    public RecyclingActivityEntity() {
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

    public Long getPuntoVerdeId() {
        return puntoVerdeId;
    }

    public void setPuntoVerdeId(Long puntoVerdeId) {
        this.puntoVerdeId = puntoVerdeId;
    }

    public String getPuntoVerdeNombre() {
        return puntoVerdeNombre;
    }

    public void setPuntoVerdeNombre(String puntoVerdeNombre) {
        this.puntoVerdeNombre = puntoVerdeNombre;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getCantidad() {
        return cantidad;
    }

    public void setCantidad(String cantidad) {
        this.cantidad = cantidad;
    }

    public String getUnidad() {
        return unidad;
    }

    public void setUnidad(String unidad) {
        this.unidad = unidad;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public RecyclingActivityStatus getStatus() {
        return status;
    }

    public void setStatus(RecyclingActivityStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
}
