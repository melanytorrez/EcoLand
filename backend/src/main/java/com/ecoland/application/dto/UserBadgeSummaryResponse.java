package com.ecoland.application.dto;

import java.util.List;

public class UserBadgeSummaryResponse {

    private List<UserBadgeResponse> earnedBadges;
    private List<BadgeProgressResponse> progress;

    public UserBadgeSummaryResponse() {
    }

    public UserBadgeSummaryResponse(List<UserBadgeResponse> earnedBadges, List<BadgeProgressResponse> progress) {
        this.earnedBadges = earnedBadges;
        this.progress = progress;
    }

    public List<UserBadgeResponse> getEarnedBadges() {
        return earnedBadges;
    }

    public List<BadgeProgressResponse> getProgress() {
        return progress;
    }
}
