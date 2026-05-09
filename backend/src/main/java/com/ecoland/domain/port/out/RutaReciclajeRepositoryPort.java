package com.ecoland.domain.port.out;

import com.ecoland.domain.model.RutaReciclaje;
import java.util.List;

public interface RutaReciclajeRepositoryPort {
    List<RutaReciclaje> findAll();
    RutaReciclaje save(RutaReciclaje ruta);
}
