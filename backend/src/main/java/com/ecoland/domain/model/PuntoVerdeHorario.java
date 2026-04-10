package com.ecoland.domain.model;

import java.time.LocalTime;

public class PuntoVerdeHorario {
    private Long id;
    private String diaSemana; // LUNES, MARTES, etc.
    private LocalTime horaApertura;
    private LocalTime horaCierre;

    public PuntoVerdeHorario() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public LocalTime getHoraApertura() { return horaApertura; }
    public void setHoraApertura(LocalTime horaApertura) { this.horaApertura = horaApertura; }

    public LocalTime getHoraCierre() { return horaCierre; }
    public void setHoraCierre(LocalTime horaCierre) { this.horaCierre = horaCierre; }
}
