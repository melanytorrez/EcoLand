package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.model.VolunteerStatus;
import com.ecoland.domain.port.out.VolunteerApplicationRepositoryPort;
import com.ecoland.infrastructure.entity.VolunteerApplicationEntity;
import com.ecoland.infrastructure.repository.JpaVolunteerApplicationRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class VolunteerApplicationRepositoryAdapter implements VolunteerApplicationRepositoryPort {

    private final JpaVolunteerApplicationRepository repository;

    public VolunteerApplicationRepositoryAdapter(JpaVolunteerApplicationRepository repository) {
        this.repository = repository;
    }

    @Override
    public VolunteerApplication save(VolunteerApplication application) {
        VolunteerApplicationEntity entity = toEntity(application);
        VolunteerApplicationEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<VolunteerApplication> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<VolunteerApplication> findByCampaignId(Long campaignId) {
        return repository.findByCampaignId(campaignId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<VolunteerApplication> findByEmailAndCampaignId(String email, Long campaignId) {
        return repository.findByUsuarioEmailAndCampaignId(email, campaignId).map(this::toDomain);
    }

    @Override
    public boolean existsByEmailAndCampaignId(String email, Long campaignId) {
        return repository.existsByUsuarioEmailAndCampaignId(email, campaignId);
    }

    @Override
    public List<VolunteerApplication> findByStatus(VolunteerStatus status) {
        return repository.findByStatus(status).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private VolunteerApplication toDomain(VolunteerApplicationEntity entity) {
        VolunteerApplication domain = new VolunteerApplication();
        domain.setId(entity.getId());
        domain.setCampaignId(entity.getCampaignId());
        domain.setUsuarioEmail(entity.getUsuarioEmail());
        domain.setFullName(entity.getFullName());
        domain.setAge(entity.getAge());
        domain.setPhone(entity.getPhone());
        domain.setAvailableWeekends(entity.getAvailableWeekends());
        domain.setHasEnvironmentalExperience(entity.getHasEnvironmentalExperience());
        domain.setExperienceDetails(entity.getExperienceDetails());
        domain.setMotivation(entity.getMotivation());
        domain.setAvailabilityHours(entity.getAvailabilityHours());
        domain.setStatus(entity.getStatus());
        domain.setFechaPostulacion(entity.getFechaPostulacion());
        domain.setAdminNotes(entity.getAdminNotes());
        return domain;
    }

    private VolunteerApplicationEntity toEntity(VolunteerApplication domain) {
        VolunteerApplicationEntity entity = new VolunteerApplicationEntity();
        entity.setId(domain.getId());
        entity.setCampaignId(domain.getCampaignId());
        entity.setUsuarioEmail(domain.getUsuarioEmail());
        entity.setFullName(domain.getFullName());
        entity.setAge(domain.getAge());
        entity.setPhone(domain.getPhone());
        entity.setAvailableWeekends(domain.getAvailableWeekends());
        entity.setHasEnvironmentalExperience(domain.getHasEnvironmentalExperience());
        entity.setExperienceDetails(domain.getExperienceDetails());
        entity.setMotivation(domain.getMotivation());
        entity.setAvailabilityHours(domain.getAvailabilityHours());
        entity.setStatus(domain.getStatus());
        entity.setFechaPostulacion(domain.getFechaPostulacion());
        entity.setAdminNotes(domain.getAdminNotes());
        return entity;
    }
}
