package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.RecyclingActivityRequest;
import com.ecoland.application.dto.RecyclingActivityResponse;
import com.ecoland.application.service.RecyclingActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recycling-activities")
public class RecyclingActivityController {

    private final RecyclingActivityService recyclingActivityService;

    public RecyclingActivityController(RecyclingActivityService recyclingActivityService) {
        this.recyclingActivityService = recyclingActivityService;
    }

    @PostMapping
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
