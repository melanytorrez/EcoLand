package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.port.in.PuntoVerdeUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puntos-verdes")
@CrossOrigin(origins = "http://localhost:4200")
public class PuntoVerdeController {

    private final PuntoVerdeUseCase puntoVerdeUseCase;

    public PuntoVerdeController(PuntoVerdeUseCase puntoVerdeUseCase) {
        this.puntoVerdeUseCase = puntoVerdeUseCase;
    }

    @GetMapping
    public ResponseEntity<List<PuntoVerde>> getAll() {
        return ResponseEntity.ok(puntoVerdeUseCase.getAllPuntosVerdes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PuntoVerde> getById(@PathVariable Long id) {
        return ResponseEntity.ok(puntoVerdeUseCase.getPuntoVerdeById(id));
    }

    @PostMapping
    public ResponseEntity<PuntoVerde> create(@RequestBody PuntoVerde puntoVerde) {
        return ResponseEntity.status(HttpStatus.CREATED).body(puntoVerdeUseCase.createPuntoVerde(puntoVerde));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PuntoVerde> update(@PathVariable Long id, @RequestBody PuntoVerde puntoVerde) {
        return ResponseEntity.ok(puntoVerdeUseCase.updatePuntoVerde(id, puntoVerde));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        puntoVerdeUseCase.deletePuntoVerde(id);
        return ResponseEntity.noContent().build();
    }
}
