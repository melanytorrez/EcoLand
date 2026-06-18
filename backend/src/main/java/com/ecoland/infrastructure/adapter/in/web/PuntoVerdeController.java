package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ErrorResponseDto;
import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.port.in.PuntoVerdeUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puntos-verdes")
@Tag(name = "Puntos Verdes", description = "Gestión de puntos de reciclaje y centros de acopio")
public class PuntoVerdeController {

    private final PuntoVerdeUseCase puntoVerdeUseCase;

    public PuntoVerdeController(PuntoVerdeUseCase puntoVerdeUseCase) {
        this.puntoVerdeUseCase = puntoVerdeUseCase;
    }

    @GetMapping
    @Operation(summary = "Listar puntos verdes", description = "Retorna todos los puntos de reciclaje registrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista obtenida", content = @Content(array = @ArraySchema(schema = @Schema(implementation = PuntoVerde.class)))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<List<PuntoVerde>> getAll() {
        return ResponseEntity.ok(puntoVerdeUseCase.getAllPuntosVerdes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener punto verde por ID", description = "Retorna los detalles de un punto verde específico.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Punto verde encontrado", content = @Content(schema = @Schema(implementation = PuntoVerde.class))),
        @ApiResponse(responseCode = "404", description = "Punto verde no encontrado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<PuntoVerde> getById(@PathVariable Long id) {
        return ResponseEntity.ok(puntoVerdeUseCase.getPuntoVerdeById(id));
    }

    @PostMapping
    @Operation(summary = "Crear punto verde", description = "Registra un nuevo punto de reciclaje (Solo Administradores).")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Punto verde creado", content = @Content(schema = @Schema(implementation = PuntoVerde.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
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
