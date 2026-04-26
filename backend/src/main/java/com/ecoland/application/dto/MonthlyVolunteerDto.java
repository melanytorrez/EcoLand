package com.ecoland.application.dto;

public class MonthlyVolunteerDto {
    private String month;
    private Long totalVolunteers;

    public MonthlyVolunteerDto(String month, Long totalVolunteers) {
        this.month = month;
        this.totalVolunteers = totalVolunteers;
    }

    public String getMonth() { return month; }
    public Long getTotalVolunteers() { return totalVolunteers; }
}
