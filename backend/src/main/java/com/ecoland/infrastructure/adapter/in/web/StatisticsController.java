package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ComprehensiveStatisticsDto;
import com.ecoland.application.dto.EnvironmentalImpactDto;
import com.ecoland.application.dto.QuickStatsDto;
import com.ecoland.application.service.StatisticsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/quick")
    public QuickStatsDto getQuickStats() {
        return statisticsService.getQuickStats();
    }

    @GetMapping("/environmental-impact")
    public EnvironmentalImpactDto getEnvironmentalImpact() {
        return statisticsService.getEnvironmentalImpact();
    }

    @GetMapping("/comprehensive")
    public ComprehensiveStatisticsDto getComprehensiveStatistics() {
        return statisticsService.getComprehensiveStatistics();
    }
}
