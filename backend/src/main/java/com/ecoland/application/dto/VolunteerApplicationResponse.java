package com.ecoland.application.dto;

import com.ecoland.domain.model.VolunteerApplication;
import com.ecoland.domain.model.VolunteerStatus;

import java.time.LocalDateTime;

public class VolunteerApplicationResponse {

    private Long id;
    private Long campaignId;
    private String usuarioEmail;
    private String fullName;
    private Integer age;
    private String phone;
    private Boolean availableWeekends;
    private Boolean hasEnvironmentalExperience;
    private String experienceDetails;
    private String motivation;
    private String availabilityHours;
    private VolunteerStatus status;
    private LocalDateTime fechaPostulacion;
    private String adminNotes;

    public static VolunteerApplicationResponse fromDomain(VolunteerApplication application) {
        VolunteerApplicationResponse response = new VolunteerApplicationResponse();
        response.setId(application.getId());
        response.setCampaignId(application.getCampaignId());
        response.setUsuarioEmail(application.getUsuarioEmail());
        response.setFullName(application.getFullName());
        response.setAge(application.getAge());
        response.setPhone(application.getPhone());
        response.setAvailableWeekends(application.getAvailableWeekends());
        response.setHasEnvironmentalExperience(application.getHasEnvironmentalExperience());
        response.setExperienceDetails(application.getExperienceDetails());
        response.setMotivation(application.getMotivation());
        response.setAvailabilityHours(application.getAvailabilityHours());
        response.setStatus(application.getStatus());
        response.setFechaPostulacion(application.getFechaPostulacion());
        response.setAdminNotes(application.getAdminNotes());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
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

    public VolunteerStatus getStatus() {
        return status;
    }

    public void setStatus(VolunteerStatus status) {
        this.status = status;
    }

    public LocalDateTime getFechaPostulacion() {
        return fechaPostulacion;
    }

    public void setFechaPostulacion(LocalDateTime fechaPostulacion) {
        this.fechaPostulacion = fechaPostulacion;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}