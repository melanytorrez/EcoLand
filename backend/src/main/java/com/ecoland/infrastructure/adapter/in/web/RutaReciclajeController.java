package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.RutaReciclaje;
import com.ecoland.domain.port.in.RutaReciclajeUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rutas")
public class RutaReciclajeController {

    private final RutaReciclajeUseCase useCase;

    public RutaReciclajeController(RutaReciclajeUseCase useCase) {
        this.useCase = useCase;
    }

    @GetMapping
    public ResponseEntity<List<RutaReciclaje>> getAllRutas() {
        return ResponseEntity.ok(useCase.getAllRutas());
    }
}
