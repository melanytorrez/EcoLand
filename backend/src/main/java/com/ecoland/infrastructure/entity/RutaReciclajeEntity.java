package com.ecoland.infrastructure.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "rutas_reciclaje")
public class RutaReciclajeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String zona;

    @Column(nullable = false)
    private String diaSemana;

    @Column(nullable = false)
    private String horario;

    private String vehiculoAsignado;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ruta_coordenadas", joinColumns = @JoinColumn(name = "ruta_id"))
    @Column(name = "coordenada")
    private List<String> coordenadas;

    public RutaReciclajeEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getZona() { return zona; }
    public void setZona(String zona) { this.zona = zona; }

    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }

    public String getVehiculoAsignado() { return vehiculoAsignado; }
    public void setVehiculoAsignado(String vehiculoAsignado) { this.vehiculoAsignado = vehiculoAsignado; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public List<String> getCoordenadas() { return coordenadas; }
    public void setCoordenadas(List<String> coordenadas) { this.coordenadas = coordenadas; }
}
