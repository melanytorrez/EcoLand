package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ErrorResponseDto;
import com.ecoland.application.dto.UsuarioResponse;
import com.ecoland.application.dto.UserBadgeSummaryResponse;
import com.ecoland.application.service.BadgeService;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import com.ecoland.domain.model.Campaign;

@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios", description = "Gestión de perfiles de usuario y participaciones")
public class UsuarioController {

    private final UsuarioUseCase usuarioUseCase;
    private final BadgeService badgeService;

    public UsuarioController(UsuarioUseCase usuarioUseCase, BadgeService badgeService) {
        this.usuarioUseCase = usuarioUseCase;
        this.badgeService = badgeService;
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Obtener usuario por ID", description = "Retorna la información pública de un usuario específico.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario encontrado", content = @Content(schema = @Schema(implementation = UsuarioResponse.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<UsuarioResponse> getUsuario(@PathVariable Long id) {
        return usuarioUseCase.getUsuarioById(id)
                .map(u -> ResponseEntity.ok(UsuarioResponse.fromUsuario(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Obtener perfil actual", description = "Retorna la información detallada del usuario autenticado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Perfil obtenido exitosamente", content = @Content(schema = @Schema(implementation = UsuarioResponse.class))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<UsuarioResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return usuarioUseCase.getUsuarioByEmail(authentication.getName())
                .map(u -> ResponseEntity.ok(UsuarioResponse.fromUsuario(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioUseCase.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<UsuarioResponse> updateUsuario(@RequestBody Usuario userDetails) {
        if (userDetails.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        return usuarioUseCase.getUsuarioById(userDetails.getId())
                .map(existingUser -> {
                    existingUser.setNombre(userDetails.getNombre());
                    Usuario updated = usuarioUseCase.createUsuario(existingUser);
                    return ResponseEntity.ok(UsuarioResponse.fromUsuario(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me/participations")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Obtener mis participaciones", description = "Retorna una lista de todas las campañas en las que el usuario actual se ha inscrito.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de participaciones obtenida", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Campaign.class)))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<List<Campaign>> getMyParticipations(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(usuarioUseCase.getParticipacionesCompletas(authentication.getName()));
    }

    @GetMapping("/me/badges")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Obtener mis insignias", description = "Retorna un resumen de las insignias y el progreso del usuario actual.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Insignias obtenidas", content = @Content(schema = @Schema(implementation = UserBadgeSummaryResponse.class))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<UserBadgeSummaryResponse> getMyBadges(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(badgeService.getBadgeSummary(authentication.getName()));
    }

    @PostMapping("/me/request-leader")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Solicitar estatus de Líder", description = "Envía una solicitud para que el usuario sea promovido a Líder de comunidad.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Solicitud enviada", content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<Void> requestLeader(Authentication authentication, @RequestBody Usuario promotionData) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        try {
            usuarioUseCase.requestLeaderStatus(authentication.getName(), promotionData);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
