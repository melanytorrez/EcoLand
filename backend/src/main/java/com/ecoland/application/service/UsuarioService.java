package com.ecoland.application.service;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import com.ecoland.domain.port.out.RolRepositoryPort;
import com.ecoland.domain.model.EstadoSolicitud;
import com.ecoland.domain.model.Rol;
import com.ecoland.infrastructure.config.AppConstants;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class UsuarioService implements UsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final CampaignRepositoryPort campaignRepositoryPort;
    private final JpaUsuarioCampaignRepository usuarioCampaignRepository;
    private final RolRepositoryPort rolRepositoryPort;

    public UsuarioService(UsuarioRepositoryPort usuarioRepositoryPort,
                          CampaignRepositoryPort campaignRepositoryPort,
                          JpaUsuarioCampaignRepository usuarioCampaignRepository,
                          RolRepositoryPort rolRepositoryPort) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
        this.campaignRepositoryPort = campaignRepositoryPort;
        this.usuarioCampaignRepository = usuarioCampaignRepository;
        this.rolRepositoryPort = rolRepositoryPort;
    }

    @Override
    public Optional<Usuario> getUsuarioById(Long id) {
        return usuarioRepositoryPort.findById(id);
    }

    @Override
    public Optional<Usuario> getUsuarioByEmail(String email) {
        return usuarioRepositoryPort.findByEmail(email);
    }

    @Override
    public Optional<Usuario> buscarUsuarioPorEmail(String email) {
        return usuarioRepositoryPort.findByEmail(email);
    }

    @Override
    public Usuario createUsuario(Usuario usuario) {
        return usuarioRepositoryPort.save(usuario);
    }

    @Override
    public void deleteUsuario(Long id) {
        usuarioRepositoryPort.deleteById(id);
    }

    @Override
    public java.util.List<com.ecoland.domain.model.Campaign> getParticipacionesCompletas(String email) {
        return usuarioCampaignRepository.findByUsuarioEmail(email)
                .stream()
                .map(UsuarioCampaignEntity::getCampaignId)
                .map(campaignRepositoryPort::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
    }

    @Override
    public void requestLeaderStatus(String email) {
        Usuario usuario = usuarioRepositoryPort.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(AppConstants.MSG_USER_NOT_FOUND));
        
        if (usuario.getEstadoSolicitud() == EstadoSolicitud.NONE || usuario.getEstadoSolicitud() == EstadoSolicitud.REJECTED) {
            usuario.setEstadoSolicitud(EstadoSolicitud.PENDING);
            usuarioRepositoryPort.save(usuario);
        }
    }

    @Override
    public void approveLeaderRequest(Long userId) {
        Usuario usuario = usuarioRepositoryPort.findById(userId)
                .orElseThrow(() -> new RuntimeException(AppConstants.MSG_USER_NOT_FOUND));
        
        if (usuario.getEstadoSolicitud() == EstadoSolicitud.PENDING) {
            usuario.setEstadoSolicitud(EstadoSolicitud.APPROVED);
            
            Rol roleLeader = rolRepositoryPort.findByNombre(AppConstants.ROLE_LEADER)
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            usuario.getRoles().add(roleLeader);
            
            usuarioRepositoryPort.save(usuario);
        }
    }

    @Override
    public void rejectLeaderRequest(Long userId) {
        Usuario usuario = usuarioRepositoryPort.findById(userId)
                .orElseThrow(() -> new RuntimeException(AppConstants.MSG_USER_NOT_FOUND));
        
        if (usuario.getEstadoSolicitud() == EstadoSolicitud.PENDING) {
            usuario.setEstadoSolicitud(EstadoSolicitud.REJECTED);
            usuarioRepositoryPort.save(usuario);
        }
    }

    @Override
    public List<Usuario> getPendingLeaderRequests() {
        return usuarioRepositoryPort.findByEstadoSolicitud(EstadoSolicitud.PENDING);
    }
}
