package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ErrorResponseDto;
import com.ecoland.application.dto.RecyclingActivityRequest;
import com.ecoland.application.dto.RecyclingActivityResponse;
import com.ecoland.application.service.RecyclingActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recycling-activities")
@Tag(name = "Actividades de Reciclaje", description = "Registro y consulta de entregas de material reciclado")
public class RecyclingActivityController {

    private final RecyclingActivityService recyclingActivityService;

    public RecyclingActivityController(RecyclingActivityService recyclingActivityService) {
        this.recyclingActivityService = recyclingActivityService;
    }

    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Registrar actividad de reciclaje", description = "Registra una nueva entrega de material en un punto verde.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Actividad registrada", content = @Content(schema = @Schema(implementation = RecyclingActivityResponse.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<RecyclingActivityResponse> registerActivity(@Valid @RequestBody RecyclingActivityRequest request,
                                                                      Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(
                RecyclingActivityResponse.fromEntity(recyclingActivityService.registerActivity(
                        authentication.getName(),
                        request.getPuntoVerdeId(),
                        request.getMaterial(),
                        request.getCantidad(),
                        request.getUnidad(),
                        request.getComentario()
                ))
        );
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Ver mis actividades", description = "Retorna el historial de reciclaje del usuario autenticado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Historial obtenido", content = @Content(array = @ArraySchema(schema = @Schema(implementation = RecyclingActivityResponse.class)))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<List<RecyclingActivityResponse>> getMyActivities(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(
                recyclingActivityService.getMyActivities(authentication.getName()).stream()
                        .map(RecyclingActivityResponse::fromEntity)
                        .toList()
        );
    }
}
