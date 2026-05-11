package com.ecoland.application.dto;

public class ResidueDataDto {
    private String type;
    private Double amount;

    public ResidueDataDto(String type, Double amount) {
        this.type = type;
        this.amount = amount;
    }

    public String getType() { return type; }
    public Double getAmount() { return amount; }
}
