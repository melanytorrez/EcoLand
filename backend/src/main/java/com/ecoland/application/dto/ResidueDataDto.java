package com.ecoland.application.dto;

public class ResidueDataDto {
    private String type;
    private Double percentage;

    public ResidueDataDto(String type, Double percentage) {
        this.type = type;
        this.percentage = percentage;
    }

    public String getType() { return type; }
    public Double getPercentage() { return percentage; }
}
