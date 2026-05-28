package com.ecoland.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VolunteerApplicationRequest {

    @NotNull(message = "La campaña es obligatoria")
    private Long campaignId;

    @NotBlank(message = "El nombre completo es obligatorio")
    private String fullName;

    @NotNull(message = "La edad es obligatoria")
    @Min(value = 18, message = "Debes ser mayor de edad para postularte")
    private Integer age;

    @NotBlank(message = "El teléfono es obligatorio")
    private String phone;

    @NotNull(message = "Debes indicar si tienes disponibilidad de fin de semana")
    private Boolean availableWeekends;

    @NotNull(message = "Debes indicar si tienes experiencia ambiental")
    private Boolean hasEnvironmentalExperience;

    private String experienceDetails;

    @NotBlank(message = "La motivación es obligatoria")
    private String motivation;

    @NotBlank(message = "La disponibilidad horaria es obligatoria")
    private String availabilityHours;

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getAvailableWeekends() {
        return availableWeekends;
    }

    public void setAvailableWeekends(Boolean availableWeekends) {
        this.availableWeekends = availableWeekends;
    }

    public Boolean getHasEnvironmentalExperience() {
        return hasEnvironmentalExperience;
    }

    public void setHasEnvironmentalExperience(Boolean hasEnvironmentalExperience) {
        this.hasEnvironmentalExperience = hasEnvironmentalExperience;
    }

    public String getExperienceDetails() {
        return experienceDetails;
    }

    public void setExperienceDetails(String experienceDetails) {
        this.experienceDetails = experienceDetails;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }

    public String getAvailabilityHours() {
        return availabilityHours;
    }

    public void setAvailabilityHours(String availabilityHours) {
        this.availabilityHours = availabilityHours;
    }
}