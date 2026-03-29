package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.entity.CampaignEntity;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class CampaignRepositoryAdapter implements CampaignRepositoryPort {

	private final JpaCampaignRepository jpaCampaignRepository;

	public CampaignRepositoryAdapter(JpaCampaignRepository jpaCampaignRepository) {
		this.jpaCampaignRepository = jpaCampaignRepository;
	}

	@Override
	public List<Campaign> findAll() {
		return jpaCampaignRepository.findAll().stream().map(this::toDomain).toList();
	}

	@Override
	public Optional<Campaign> findById(Long id) {
		return jpaCampaignRepository.findById(id).map(this::toDomain);
	}

	@Override
	public Campaign save(Campaign campaign) {
		return toDomain(jpaCampaignRepository.save(toEntity(campaign)));
	}

	@Override
	public void deleteById(Long id) {
		jpaCampaignRepository.deleteById(id);
	}

	private Campaign toDomain(CampaignEntity entity) {
		Campaign campaign = new Campaign();
		campaign.setId(entity.getId());
		campaign.setImage(entity.getImage());
		campaign.setTitle(entity.getTitle());
		campaign.setDate(entity.getDate());
		campaign.setTime(entity.getTime());
		campaign.setLocation(entity.getLocation());
		campaign.setAddress(entity.getAddress());
		campaign.setSpots(entity.getSpots());
		campaign.setParticipants(entity.getParticipants());
		campaign.setOrganizer(entity.getOrganizer());
		campaign.setOrganizerContact(entity.getOrganizerContact());
		campaign.setStatus(entity.getStatus());
		campaign.setDescription(entity.getDescription());
		campaign.setRequirements(entity.getRequirements());
		return campaign;
	}

	private CampaignEntity toEntity(Campaign campaign) {
		CampaignEntity entity = new CampaignEntity();
		entity.setId(campaign.getId());
		entity.setImage(campaign.getImage());
		entity.setTitle(campaign.getTitle());
		entity.setDate(campaign.getDate());
		entity.setTime(campaign.getTime());
		entity.setLocation(campaign.getLocation());
		entity.setAddress(campaign.getAddress());
		entity.setSpots(campaign.getSpots());
		entity.setParticipants(campaign.getParticipants());
		entity.setOrganizer(campaign.getOrganizer());
		entity.setOrganizerContact(campaign.getOrganizerContact());
		entity.setStatus(campaign.getStatus());
		entity.setDescription(campaign.getDescription());
		entity.setRequirements(campaign.getRequirements() == null ? new ArrayList<>() : campaign.getRequirements());
		return entity;
	}
}
