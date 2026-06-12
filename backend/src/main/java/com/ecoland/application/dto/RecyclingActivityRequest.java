package com.ecoland.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RecyclingActivityRequest {

    @NotNull(message = "El punto verde es obligatorio")
    private Long puntoVerdeId;

    @NotBlank(message = "El material reciclado es obligatorio")
    private String material;

    @Size(max = 80, message = "La cantidad no debe superar los 80 caracteres")
    private String cantidad;

    @Size(max = 40, message = "La unidad no debe superar los 40 caracteres")
    private String unidad;

    @Size(max = 800, message = "El comentario no debe superar los 800 caracteres")
    private String comentario;

    public Long getPuntoVerdeId() {
        return puntoVerdeId;
    }

    public void setPuntoVerdeId(Long puntoVerdeId) {
        this.puntoVerdeId = puntoVerdeId;
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
}
