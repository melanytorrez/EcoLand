package com.ecoland.application.dto;

import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.infrastructure.entity.RecyclingActivityEntity;

import java.time.LocalDateTime;

public class RecyclingActivityResponse {

    private Long id;
    private String usuarioEmail;
    private Long puntoVerdeId;
    private String puntoVerdeNombre;
    private String material;
    private String cantidad;
    private String unidad;
    private String comentario;
    private RecyclingActivityStatus status;
    private String adminNotes;
    private LocalDateTime registeredAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;

    public static RecyclingActivityResponse fromEntity(RecyclingActivityEntity entity) {
        RecyclingActivityResponse response = new RecyclingActivityResponse();
        response.setId(entity.getId());
        response.setUsuarioEmail(entity.getUsuarioEmail());
        response.setPuntoVerdeId(entity.getPuntoVerdeId());
        response.setPuntoVerdeNombre(entity.getPuntoVerdeNombre());
        response.setMaterial(entity.getMaterial());
        response.setCantidad(entity.getCantidad());
        response.setUnidad(entity.getUnidad());
        response.setComentario(entity.getComentario());
        response.setStatus(entity.getStatus());
        response.setAdminNotes(entity.getAdminNotes());
        response.setRegisteredAt(entity.getRegisteredAt());
        response.setReviewedAt(entity.getReviewedAt());
        response.setReviewedBy(entity.getReviewedBy());
        return response;
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
