package com.ecoland.infrastructure.adapter.in.web;

import com.ecoland.application.dto.ComprehensiveStatisticsDto;
import com.ecoland.application.dto.EnvironmentalImpactDto;
import com.ecoland.application.dto.ErrorResponseDto;
import com.ecoland.application.dto.QuickStatsDto;
import com.ecoland.application.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
@Tag(name = "Statistics", description = "Estadísticas de impacto ambiental y reciclaje")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/quick")
    @Operation(summary = "Obtener estadísticas rápidas", description = "Retorna métricas clave para el dashboard principal.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas", content = @Content(schema = @Schema(implementation = QuickStatsDto.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
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
