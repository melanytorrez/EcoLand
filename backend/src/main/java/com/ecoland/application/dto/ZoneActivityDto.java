package com.ecoland.application.dto;

public class ZoneActivityDto {
    private String zone;
    private Long activities;

    public ZoneActivityDto(String zone, Long activities) {
        this.zone = zone;
        this.activities = activities;
    }

    public String getZone() { return zone; }
    public Long getActivities() { return activities; }
}
