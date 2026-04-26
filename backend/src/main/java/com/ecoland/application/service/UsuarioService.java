package com.ecoland.application.service;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService implements UsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final CampaignRepositoryPort campaignRepositoryPort;
    private final JpaUsuarioCampaignRepository usuarioCampaignRepository;

    public UsuarioService(UsuarioRepositoryPort usuarioRepositoryPort,
                          CampaignRepositoryPort campaignRepositoryPort,
                          JpaUsuarioCampaignRepository usuarioCampaignRepository) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
        this.campaignRepositoryPort = campaignRepositoryPort;
        this.usuarioCampaignRepository = usuarioCampaignRepository;
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
}
