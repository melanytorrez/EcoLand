package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.entity.CampaignEntity;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.ecoland.domain.model.CampaignCategory;

@Component
public class CampaignRepositoryAdapter implements CampaignRepositoryPort {

    private final JpaCampaignRepository repository;

    public CampaignRepositoryAdapter(JpaCampaignRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Campaign> findAll() {
        return repository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Campaign> findByCategory(CampaignCategory category) {
        return repository.findByCategory(category).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Campaign> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Campaign save(Campaign campaign) {
        CampaignEntity entity = toEntity(campaign);
        CampaignEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    private Campaign toDomain(CampaignEntity entity) {
        Campaign domain = new Campaign();
        domain.setId(entity.getId());
        domain.setImage(entity.getImage());
        domain.setTitle(entity.getTitle());
        domain.setDate(entity.getDate());
        domain.setTime(entity.getTime());
        domain.setLocation(entity.getLocation());
        domain.setAddress(entity.getAddress());
        domain.setSpots(entity.getSpots());
        domain.setParticipants(entity.getParticipants());
        domain.setOrganizer(entity.getOrganizer());
        domain.setOrganizerContact(entity.getOrganizerContact());
        domain.setStatus(entity.getStatus());
        domain.setDescription(entity.getDescription());
        domain.setRequirements(entity.getRequirements());
        domain.setCategory(entity.getCategory());
        return domain;
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
        entity.setRequirements(campaign.getRequirements());
        entity.setCategory(campaign.getCategory());
        return entity;
    }
}
