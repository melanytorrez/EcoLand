package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.VolunteerApplicationResponse;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.VolunteerStatus;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.domain.port.in.VolunteerApplicationUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UsuarioUseCase usuarioUseCase;
    private final VolunteerApplicationUseCase volunteerApplicationUseCase;

    public AdminController(UsuarioUseCase usuarioUseCase, VolunteerApplicationUseCase volunteerApplicationUseCase) {
        this.usuarioUseCase = usuarioUseCase;
        this.volunteerApplicationUseCase = volunteerApplicationUseCase;
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
    public ResponseEntity<List<Usuario>> getAllUsers() {
        return ResponseEntity.ok(usuarioUseCase.getAllUsuarios());
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
}
