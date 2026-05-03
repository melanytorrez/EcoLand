package com.ecoland.infrastructure.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "puntos_verdes")
public class PuntoVerdeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creator_id")
    private Long creatorId;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String zona;

    @Column(nullable = false)
    private String estado;

    @OneToMany(mappedBy = "puntoVerde", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PuntoVerdeHorarioEntity> horarios;

    @ElementCollection
    @CollectionTable(name = "punto_verde_materiales", joinColumns = @JoinColumn(name = "punto_verde_id"))
    @Column(name = "tipo_material")
    private List<String> tiposMaterial;

    private Double latitud;
    private Double longitud;

    public PuntoVerdeEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getZona() {
        return zona;
    }

    public void setZona(String zona) {
        this.zona = zona;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<PuntoVerdeHorarioEntity> getHorarios() {
        return horarios;
    }

    public void setHorarios(List<PuntoVerdeHorarioEntity> horarios) {
        this.horarios = horarios;
    }

    public List<String> getTiposMaterial() {
        return tiposMaterial;
    }

    public void setTiposMaterial(List<String> tiposMaterial) {
        this.tiposMaterial = tiposMaterial;
    }

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }

}
