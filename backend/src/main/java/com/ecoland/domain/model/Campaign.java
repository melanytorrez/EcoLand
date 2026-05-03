package com.ecoland.domain.model;

import java.util.List;

public class Campaign {
    private Long id;
    private Long creatorId;
    private String image;
    private String title;
    private String date;
    private String time;
    private String location;
    private String address;
    private int spots;
    private int participants;
    private String organizer;
    private String organizerContact;
    private String status;
    private String description;
    private List<String> requirements;
    private CampaignCategory category;

    public Campaign() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getSpots() { return spots; }
    public void setSpots(int spots) { this.spots = spots; }

    public int getParticipants() { return participants; }
    public void setParticipants(int participants) { this.participants = participants; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getOrganizerContact() { return organizerContact; }
    public void setOrganizerContact(String organizerContact) { this.organizerContact = organizerContact; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getRequirements() { return requirements; }
    public void setRequirements(List<String> requirements) { this.requirements = requirements; }

    public CampaignCategory getCategory() { return category; }
    public void setCategory(CampaignCategory category) { this.category = category; }
}
