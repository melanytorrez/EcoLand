package com.ecoland.application.service;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.in.CampaignUseCase;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CampaignService implements CampaignUseCase {

	private final CampaignRepositoryPort campaignRepositoryPort;
	private final UsuarioRepositoryPort usuarioRepositoryPort;

	public CampaignService(CampaignRepositoryPort campaignRepositoryPort, UsuarioRepositoryPort usuarioRepositoryPort) {
		this.campaignRepositoryPort = campaignRepositoryPort;
		this.usuarioRepositoryPort = usuarioRepositoryPort;
	}

	@Override
	public List<Campaign> getAllCampaigns() {
		return campaignRepositoryPort.findAll();
	}

	@Override
	public Optional<Campaign> getCampaignById(Long id) {
		return campaignRepositoryPort.findById(id);
	}

	@Override
	public Campaign participateInCampaign(Long campaignId, String userEmail) {
		if (userEmail == null || userEmail.isBlank()) {
			throw new IllegalArgumentException("Usuario no autenticado");
		}

		usuarioRepositoryPort.findByEmail(userEmail)
				.orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

		Campaign campaign = campaignRepositoryPort.findById(campaignId)
				.orElseThrow(() -> new IllegalArgumentException("Campana no encontrada"));

		if (campaign.getParticipants() >= campaign.getSpots()) {
			throw new IllegalStateException("No hay cupos disponibles");
		}

		campaign.setParticipants(campaign.getParticipants() + 1);
		return campaignRepositoryPort.save(campaign);
	}
}
