package com.ecoland.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.port.in.PuntoVerdeUseCase;
import com.ecoland.domain.port.out.PuntoVerdeRepositoryPort;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.domain.model.Usuario;
import com.ecoland.infrastructure.config.AppConstants;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PuntoVerdeService implements PuntoVerdeUseCase {

    private final PuntoVerdeRepositoryPort puntoVerdeRepositoryPort;
    private final UsuarioRepositoryPort usuarioRepositoryPort;

    public PuntoVerdeService(PuntoVerdeRepositoryPort puntoVerdeRepositoryPort,
                             UsuarioRepositoryPort usuarioRepositoryPort) {
        this.puntoVerdeRepositoryPort = puntoVerdeRepositoryPort;
        this.usuarioRepositoryPort = usuarioRepositoryPort;
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof String email) {
            return usuarioRepositoryPort.findByEmail(email)
                .map(Usuario::getId)
                .orElse(null);
        }
        return null;
    }

    private boolean isUserAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + AppConstants.ROLE_ADMIN));
        }
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PuntoVerde> getAllPuntosVerdes() {
        return puntoVerdeRepositoryPort.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PuntoVerde getPuntoVerdeById(Long id) {
        return puntoVerdeRepositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Punto Verde no encontrado"));
    }

    @Override
    public PuntoVerde createPuntoVerde(PuntoVerde puntoVerde) {
        puntoVerde.setCreatorId(getCurrentUserId());
        return puntoVerdeRepositoryPort.save(puntoVerde);
    }

    @Override
    public PuntoVerde updatePuntoVerde(Long id, PuntoVerde puntoVerde) {
        PuntoVerde existing = puntoVerdeRepositoryPort.findById(id).orElseThrow(() -> new RuntimeException("Punto Verde no encontrado"));
        Long currentUserId = getCurrentUserId();
        
        if (!isUserAdmin() && (existing.getCreatorId() == null || !existing.getCreatorId().equals(currentUserId))) {
            throw new AccessDeniedException("No tienes permiso para editar este punto verde");
        }
        
        puntoVerde.setId(id);
        puntoVerde.setCreatorId(existing.getCreatorId()); // Preserve original creator
        return puntoVerdeRepositoryPort.save(puntoVerde);
    }

    @Override
    public void deletePuntoVerde(Long id) {
        PuntoVerde existing = puntoVerdeRepositoryPort.findById(id).orElseThrow(() -> new RuntimeException("Punto Verde no encontrado"));
        Long currentUserId = getCurrentUserId();
        
        if (!isUserAdmin() && (existing.getCreatorId() == null || !existing.getCreatorId().equals(currentUserId))) {
            throw new AccessDeniedException("No tienes permiso para eliminar este punto verde");
        }
        
        puntoVerdeRepositoryPort.deleteById(id);
    }

}
