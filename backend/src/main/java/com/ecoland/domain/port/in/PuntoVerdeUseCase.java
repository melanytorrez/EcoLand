package com.ecoland.domain.port.in;

import java.util.List;

import com.ecoland.domain.model.PuntoVerde;

public interface PuntoVerdeUseCase {
    List<PuntoVerde> getAllPuntosVerdes();
    PuntoVerde getPuntoVerdeById(Long id);
    PuntoVerde createPuntoVerde(PuntoVerde puntoVerde);
    PuntoVerde updatePuntoVerde(Long id, PuntoVerde puntoVerde);
    void deletePuntoVerde(Long id);
}
