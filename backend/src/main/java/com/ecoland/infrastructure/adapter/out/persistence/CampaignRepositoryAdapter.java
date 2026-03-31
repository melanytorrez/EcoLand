package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.entity.CampaignEntity;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CampaignRepositoryAdapter implements CampaignRepositoryPort {

    private static final Logger logger = LoggerFactory.getLogger(CampaignRepositoryAdapter.class);

    private final JpaCampaignRepository repository;

    public CampaignRepositoryAdapter(JpaCampaignRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Campaign> findAll() {
        try {
            List<Campaign> campaigns = repository.findAll().stream()
                    .map(this::toDomain)
                    .collect(Collectors.toList());

            if (campaigns.isEmpty()) {
                logger.warn("Database query returned an empty campaign list (verify if this is expected)");
            }

            return campaigns;
        } catch (TransientDataAccessException ex) {
            logger.error("SQL transient error while querying all campaigns", ex);
            throw ex;
        } catch (DataAccessException ex) {
            logger.error("Database access error while querying all campaigns", ex);
            throw ex;
        }
    }

    @Override
    public Optional<Campaign> findById(Long id) {
        try {
            Optional<Campaign> campaign = repository.findById(id).map(this::toDomain);
            if (campaign.isEmpty()) {
                logger.warn("Database query returned no campaign for id={}", id);
            }
            return campaign;
        } catch (TransientDataAccessException ex) {
            logger.error("SQL transient error while querying campaign by id={}", id, ex);
            throw ex;
        } catch (DataAccessException ex) {
            logger.error("Database access error while querying campaign by id={}", id, ex);
            throw ex;
        }
    }

    @Override
    public Campaign save(Campaign campaign) {
        try {
            CampaignEntity entity = toEntity(campaign);
            CampaignEntity saved = repository.save(entity);

            logger.info(
                    "AUDIT DB: campaign persisted successfully (campaignId={}, title={})",
                    saved.getId(),
                    saved.getTitle()
            );

            return toDomain(saved);
        } catch (TransientDataAccessException ex) {
            logger.error("SQL transient error while saving campaign with id={}", campaign.getId(), ex);
            throw ex;
        } catch (DataAccessException ex) {
            logger.error("Database access error while saving campaign with id={}", campaign.getId(), ex);
            throw ex;
        }
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
        return entity;
    }
}
