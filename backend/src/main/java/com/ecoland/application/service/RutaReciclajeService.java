package com.ecoland.application.service;

import com.ecoland.domain.model.RutaReciclaje;
import com.ecoland.domain.port.in.RutaReciclajeUseCase;
import com.ecoland.domain.port.out.RutaReciclajeRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RutaReciclajeService implements RutaReciclajeUseCase {

    private final RutaReciclajeRepositoryPort repositoryPort;

    public RutaReciclajeService(RutaReciclajeRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RutaReciclaje> getAllRutas() {
        return repositoryPort.findAll();
    }
}
