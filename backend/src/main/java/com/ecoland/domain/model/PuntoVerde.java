package com.ecoland.domain.model;

import java.util.List;

public class PuntoVerde {
    private Long id;
    private String nombre;
    private String direccion;
    private String zona;
    private String estado;
    private List<PuntoVerdeHorario> horarios;
    private List<String> tiposMaterial;

    public PuntoVerde() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getZona() { return zona; }
    public void setZona(String zona) { this.zona = zona; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<PuntoVerdeHorario> getHorarios() { return horarios; }
    public void setHorarios(List<PuntoVerdeHorario> horarios) { this.horarios = horarios; }

    public List<String> getTiposMaterial() { return tiposMaterial; }
    public void setTiposMaterial(List<String> tiposMaterial) { this.tiposMaterial = tiposMaterial; }

}
