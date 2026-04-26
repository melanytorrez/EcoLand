package com.ecoland.application.dto;

public class MonthlyDataDto {
    private String month;
    private Long value;

    public MonthlyDataDto(String month, Long value) {
        this.month = month;
        this.value = value;
    }

    public String getMonth() { return month; }
    public Long getValue() { return value; }
}
