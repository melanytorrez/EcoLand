package com.ecoland.domain.model;

import java.util.List;

public class RutaReciclaje {
    private Long id;
    private String zona;
    private String diaSemana;
    private String horario;
    private String vehiculoAsignado;
    private String descripcion;
    private List<String> coordenadas;

    public RutaReciclaje() {}

    public RutaReciclaje(Long id, String zona, String diaSemana, String horario, String vehiculoAsignado, String descripcion, List<String> coordenadas) {
        this.id = id;
        this.zona = zona;
        this.diaSemana = diaSemana;
        this.horario = horario;
        this.vehiculoAsignado = vehiculoAsignado;
        this.descripcion = descripcion;
        this.coordenadas = coordenadas;
    }

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
