package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ErrorResponseDto;
import com.ecoland.application.dto.RecyclingActivityResponse;
import com.ecoland.application.dto.VolunteerApplicationResponse;
import com.ecoland.application.dto.UsuarioResponse;
import com.ecoland.application.service.RecyclingActivityService;
import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.VolunteerStatus;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.domain.port.in.VolunteerApplicationUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Administración", description = "Operaciones administrativas (Usuarios, Roles, Postulaciones)")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    private final UsuarioUseCase usuarioUseCase;
    private final VolunteerApplicationUseCase volunteerApplicationUseCase;
    private final RecyclingActivityService recyclingActivityService;

    public AdminController(UsuarioUseCase usuarioUseCase,
                           VolunteerApplicationUseCase volunteerApplicationUseCase,
                           RecyclingActivityService recyclingActivityService) {
        this.usuarioUseCase = usuarioUseCase;
        this.volunteerApplicationUseCase = volunteerApplicationUseCase;
        this.recyclingActivityService = recyclingActivityService;
    }

    @GetMapping("/leader-requests")
    @Operation(summary = "Ver solicitudes de líder", description = "Lista todos los usuarios que han solicitado ser líderes de comunidad.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Usuario.class)))),
        @ApiResponse(responseCode = "403", description = "Acceso denegado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<List<Usuario>> getPendingLeaderRequests() {
        return ResponseEntity.ok(usuarioUseCase.getPendingLeaderRequests());
    }

    @PostMapping("/leader-requests/{userId}/approve")
    public ResponseEntity<Void> approveLeaderRequest(@PathVariable Long userId) {
        try {
            usuarioUseCase.approveLeaderRequest(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/leader-requests/{userId}/reject")
    public ResponseEntity<Void> rejectLeaderRequest(@PathVariable Long userId) {
        try {
            usuarioUseCase.rejectLeaderRequest(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users")
    @Operation(summary = "Listar todos los usuarios", description = "Retorna la lista completa de usuarios registrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuarios listados", content = @Content(array = @ArraySchema(schema = @Schema(implementation = UsuarioResponse.class)))),
        @ApiResponse(responseCode = "403", description = "Acceso denegado", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<List<UsuarioResponse>> getAllUsers() {
        List<UsuarioResponse> users = usuarioUseCase.getAllUsuarios().stream()
                .map(UsuarioResponse::fromUsuario)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/volunteer-applications")
    public ResponseEntity<List<VolunteerApplicationResponse>> getVolunteerApplications(
            @RequestParam(defaultValue = "PENDING") VolunteerStatus status) {
        return ResponseEntity.ok(
                volunteerApplicationUseCase.getApplicationsByStatus(status).stream()
                        .map(VolunteerApplicationResponse::fromDomain)
                        .toList()
        );
    }

    @PostMapping("/volunteer-applications/{applicationId}/approve")
    public ResponseEntity<VolunteerApplicationResponse> approveVolunteerApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(
                VolunteerApplicationResponse.fromDomain(volunteerApplicationUseCase.approveApplication(applicationId))
        );
    }

    @PostMapping("/volunteer-applications/{applicationId}/reject")
    public ResponseEntity<VolunteerApplicationResponse> rejectVolunteerApplication(@PathVariable Long applicationId,
                                                                                   @RequestParam(required = false, defaultValue = "") String adminNotes) {
        return ResponseEntity.ok(
                VolunteerApplicationResponse.fromDomain(volunteerApplicationUseCase.rejectApplication(applicationId, adminNotes))
        );
    }

    @GetMapping("/recycling-activities")
    public ResponseEntity<List<RecyclingActivityResponse>> getRecyclingActivities(
            @RequestParam(defaultValue = "PENDING") RecyclingActivityStatus status) {
        return ResponseEntity.ok(
                recyclingActivityService.getActivitiesByStatus(status).stream()
                        .map(RecyclingActivityResponse::fromEntity)
                        .toList()
        );
    }

    @PostMapping("/recycling-activities/{activityId}/approve")
    public ResponseEntity<RecyclingActivityResponse> approveRecyclingActivity(@PathVariable Long activityId,
                                                                               Authentication authentication) {
        return ResponseEntity.ok(
                RecyclingActivityResponse.fromEntity(
                        recyclingActivityService.approveActivity(activityId, getReviewer(authentication))
                )
        );
    }

    @PostMapping("/recycling-activities/{activityId}/reject")
    public ResponseEntity<RecyclingActivityResponse> rejectRecyclingActivity(@PathVariable Long activityId,
                                                                              @RequestParam(required = false, defaultValue = "") String adminNotes,
                                                                              Authentication authentication) {
        return ResponseEntity.ok(
                RecyclingActivityResponse.fromEntity(
                        recyclingActivityService.rejectActivity(activityId, getReviewer(authentication), adminNotes)
                )
        );
    }

    private String getReviewer(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            return "admin";
        }
        return authentication.getName();
    }
}
