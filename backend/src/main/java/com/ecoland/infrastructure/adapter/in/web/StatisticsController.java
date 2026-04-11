package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.QuickStatsDto;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final JpaCampaignRepository campaignRepository;

    public StatisticsController(JpaCampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    @GetMapping("/quick")
    public QuickStatsDto getQuickStats() {
        Long total = campaignRepository.count();
        Long activas = campaignRepository.countByStatus("Activa");
        Long voluntarios = campaignRepository.sumAllParticipants();
        return new QuickStatsDto(total, activas, voluntarios);
    }
}
