package com.ecoland.application.service;

import com.ecoland.application.dto.BadgeProgressResponse;
import com.ecoland.application.dto.UserBadgeResponse;
import com.ecoland.application.dto.UserBadgeSummaryResponse;
import com.ecoland.domain.model.Campaign;
import com.ecoland.domain.model.CampaignCategory;
import com.ecoland.domain.port.out.CampaignRepositoryPort;
import com.ecoland.infrastructure.entity.UserBadgeEntity;
import com.ecoland.infrastructure.entity.UsuarioCampaignEntity;
import com.ecoland.infrastructure.repository.JpaUserBadgeRepository;
import com.ecoland.infrastructure.repository.JpaUsuarioCampaignRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class BadgeService {

    private static final List<BadgeRule> BADGE_RULES = List.of(
            new BadgeRule("ref_1", "reforestacion", "tree-pine", 1, BadgeMetric.REFORESTATION),
            new BadgeRule("ref_5", "reforestacion", "tree-pine", 5, BadgeMetric.REFORESTATION),
            new BadgeRule("rec_1", "reciclaje", "recycle", 1, BadgeMetric.RECYCLING),
            new BadgeRule("rec_5", "reciclaje", "recycle", 5, BadgeMetric.RECYCLING),
            new BadgeRule("gen_10", "general", "award", 10, BadgeMetric.TOTAL)
    );

    private final JpaUserBadgeRepository userBadgeRepository;
    private final JpaUsuarioCampaignRepository usuarioCampaignRepository;
    private final CampaignRepositoryPort campaignRepositoryPort;

    public BadgeService(JpaUserBadgeRepository userBadgeRepository,
                        JpaUsuarioCampaignRepository usuarioCampaignRepository,
                        CampaignRepositoryPort campaignRepositoryPort) {
        this.userBadgeRepository = userBadgeRepository;
        this.usuarioCampaignRepository = usuarioCampaignRepository;
        this.campaignRepositoryPort = campaignRepositoryPort;
    }

    public UserBadgeSummaryResponse getBadgeSummary(String usuarioEmail) {
        BadgeStats stats = calculateStats(usuarioEmail);
        assignMissingBadges(usuarioEmail, stats);

        List<UserBadgeEntity> earnedEntities = userBadgeRepository.findByUsuarioEmailOrderByEarnedAtAsc(usuarioEmail);
        Set<String> earnedCodes = earnedEntities.stream()
                .map(UserBadgeEntity::getBadgeCode)
                .collect(Collectors.toSet());

        List<UserBadgeResponse> earnedBadges = earnedEntities.stream()
                .map(this::toBadgeResponse)
                .toList();

        List<BadgeProgressResponse> progress = BADGE_RULES.stream()
                .map(rule -> toProgressResponse(rule, stats, earnedCodes.contains(rule.code())))
                .toList();

        return new UserBadgeSummaryResponse(earnedBadges, progress);
    }

    public void evaluateAndAssignBadges(String usuarioEmail) {
        assignMissingBadges(usuarioEmail, calculateStats(usuarioEmail));
    }

    private void assignMissingBadges(String usuarioEmail, BadgeStats stats) {
        BADGE_RULES.stream()
                .filter(rule -> currentValue(rule, stats) >= rule.target())
                .filter(rule -> !userBadgeRepository.existsByUsuarioEmailAndBadgeCode(usuarioEmail, rule.code()))
                .forEach(rule -> saveBadge(usuarioEmail, rule));
    }

    private void saveBadge(String usuarioEmail, BadgeRule rule) {
        try {
            userBadgeRepository.save(new UserBadgeEntity(
                    usuarioEmail,
                    rule.code(),
                    rule.type(),
                    rule.iconName(),
                    LocalDateTime.now()
            ));
        } catch (DataIntegrityViolationException ignored) {
            // The unique constraint prevents duplicates if two events evaluate badges at the same time.
        }
    }

    private BadgeStats calculateStats(String usuarioEmail) {
        List<Campaign> campaigns = usuarioCampaignRepository.findByUsuarioEmail(usuarioEmail).stream()
                .map(UsuarioCampaignEntity::getCampaignId)
                .map(campaignRepositoryPort::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .toList();

        int reforestation = (int) campaigns.stream()
                .filter(campaign -> campaign.getCategory() == CampaignCategory.REFORESTATION)
                .count();
        int recycling = (int) campaigns.stream()
                .filter(campaign -> campaign.getCategory() == CampaignCategory.RECYCLING)
                .count();

        return new BadgeStats(reforestation, recycling, campaigns.size());
    }

    private UserBadgeResponse toBadgeResponse(UserBadgeEntity entity) {
        return new UserBadgeResponse(
                entity.getId(),
                entity.getBadgeCode(),
                entity.getBadgeType(),
                entity.getIconName(),
                titleKey(entity.getBadgeCode()),
                descriptionKey(entity.getBadgeCode()),
                entity.getEarnedAt()
        );
    }

    private BadgeProgressResponse toProgressResponse(BadgeRule rule, BadgeStats stats, boolean earned) {
        int current = currentValue(rule, stats);
        int cappedCurrent = Math.min(current, rule.target());
        int percentage = rule.target() == 0 ? 100 : (int) Math.round((cappedCurrent * 100.0) / rule.target());

        return new BadgeProgressResponse(
                rule.code(),
                rule.type(),
                rule.iconName(),
                titleKey(rule.code()),
                descriptionKey(rule.code()),
                cappedCurrent,
                rule.target(),
                earned,
                percentage
        );
    }

    private int currentValue(BadgeRule rule, BadgeStats stats) {
        return switch (rule.metric()) {
            case REFORESTATION -> stats.reforestation();
            case RECYCLING -> stats.recycling();
            case TOTAL -> stats.total();
        };
    }

    private String titleKey(String badgeCode) {
        return "profile.badges.list." + badgeCode + ".title";
    }

    private String descriptionKey(String badgeCode) {
        return "profile.badges.list." + badgeCode + ".description";
    }

    private enum BadgeMetric {
        REFORESTATION,
        RECYCLING,
        TOTAL
    }

    private record BadgeRule(String code, String type, String iconName, int target, BadgeMetric metric) {
    }

    private record BadgeStats(int reforestation, int recycling, int total) {
    }
}
