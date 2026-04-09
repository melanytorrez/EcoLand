package com.ecoland.domain.port.out;

import java.util.List;
import java.util.Optional;

import com.ecoland.domain.model.PuntoVerde;

public interface PuntoVerdeRepositoryPort {
    List<PuntoVerde> findAll();
    Optional<PuntoVerde> findById(Long id);
    PuntoVerde save(PuntoVerde puntoVerde);
    void deleteById(Long id);

}
