package com.ecoland.application.dto;

public class BadgeProgressResponse {

    private String code;
    private String type;
    private String iconName;
    private String titleKey;
    private String descriptionKey;
    private int current;
    private int target;
    private boolean earned;
    private int percentage;

    public BadgeProgressResponse() {
    }

    public BadgeProgressResponse(String code, String type, String iconName, String titleKey, String descriptionKey,
                                 int current, int target, boolean earned, int percentage) {
        this.code = code;
        this.type = type;
        this.iconName = iconName;
        this.titleKey = titleKey;
        this.descriptionKey = descriptionKey;
        this.current = current;
        this.target = target;
        this.earned = earned;
        this.percentage = percentage;
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

    public int getCurrent() {
        return current;
    }

    public int getTarget() {
        return target;
    }

    public boolean isEarned() {
        return earned;
    }

    public int getPercentage() {
        return percentage;
    }
}
