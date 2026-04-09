package com.ecoland.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.port.in.PuntoVerdeUseCase;
import com.ecoland.domain.port.out.PuntoVerdeRepositoryPort;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PuntoVerdeService implements PuntoVerdeUseCase {

    private final PuntoVerdeRepositoryPort puntoVerdeRepositoryPort;

    public PuntoVerdeService(PuntoVerdeRepositoryPort puntoVerdeRepositoryPort) {
        this.puntoVerdeRepositoryPort = puntoVerdeRepositoryPort;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PuntoVerde> getAllPuntosVerdes() {
        return puntoVerdeRepositoryPort.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PuntoVerde getPuntoVerdeById(Long id) {
        return puntoVerdeRepositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Punto Verde no encontrado"));
    }

    @Override
    public PuntoVerde createPuntoVerde(PuntoVerde puntoVerde) {
        return puntoVerdeRepositoryPort.save(puntoVerde);
    }

    @Override
    public PuntoVerde updatePuntoVerde(Long id, PuntoVerde puntoVerde) {
        puntoVerdeRepositoryPort.findById(id).orElseThrow(() -> new RuntimeException("Punto Verde no encontrado"));
        puntoVerde.setId(id);
        return puntoVerdeRepositoryPort.save(puntoVerde);
    }

    @Override
    public void deletePuntoVerde(Long id) {
        puntoVerdeRepositoryPort.findById(id).orElseThrow(() -> new RuntimeException("Punto Verde no encontrado"));
        puntoVerdeRepositoryPort.deleteById(id);

    }

}
