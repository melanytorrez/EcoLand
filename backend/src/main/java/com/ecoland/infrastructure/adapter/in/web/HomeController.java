package com.ecoland.infrastructure.adapter.in.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Home", description = "Servicio de estado del servidor")
public class HomeController {

    @GetMapping("/")
    @Operation(summary = "Verificar estado del servidor", description = "Endpoint simple para confirmar que el backend está en línea.")
    @ApiResponse(responseCode = "200", description = "Servidor activo")
    public String home() {
        return "¡Servidor de EcoLand funcionando en el puerto 8081! 🚀";
    }
}
