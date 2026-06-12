package com.ecoland.application.dto;

import java.time.LocalDateTime;

public class UserBadgeResponse {

    private Long id;
    private String code;
    private String type;
    private String iconName;
    private String titleKey;
    private String descriptionKey;
    private LocalDateTime earnedAt;

    public UserBadgeResponse() {
    }

    public UserBadgeResponse(Long id, String code, String type, String iconName, String titleKey,
                             String descriptionKey, LocalDateTime earnedAt) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.iconName = iconName;
        this.titleKey = titleKey;
        this.descriptionKey = descriptionKey;
        this.earnedAt = earnedAt;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getType() {
        return type;
    }

    public String getIconName() {
        return iconName;
    }

    public String getTitleKey() {
        return titleKey;
    }

    public String getDescriptionKey() {
        return descriptionKey;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }
}
