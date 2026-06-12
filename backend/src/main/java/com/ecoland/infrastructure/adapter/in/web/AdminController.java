package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.RecyclingActivityResponse;
import com.ecoland.application.dto.VolunteerApplicationResponse;
import com.ecoland.application.dto.UsuarioResponse;
import com.ecoland.application.service.RecyclingActivityService;
import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.VolunteerStatus;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.domain.port.in.VolunteerApplicationUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
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
