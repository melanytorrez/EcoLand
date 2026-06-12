package com.ecoland.infrastructure.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_badges", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_badges_usuario_code", columnNames = {"usuario_email", "badge_code"})
})
public class UserBadgeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_email", nullable = false)
    private String usuarioEmail;

    @Column(name = "badge_code", nullable = false)
    private String badgeCode;

    @Column(name = "badge_type", nullable = false)
    private String badgeType;

    @Column(name = "icon_name", nullable = false)
    private String iconName;

    @Column(name = "earned_at", nullable = false)
    private LocalDateTime earnedAt;

    public UserBadgeEntity() {
    }

    public UserBadgeEntity(String usuarioEmail, String badgeCode, String badgeType, String iconName, LocalDateTime earnedAt) {
        this.usuarioEmail = usuarioEmail;
        this.badgeCode = badgeCode;
        this.badgeType = badgeType;
        this.iconName = iconName;
        this.earnedAt = earnedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
    }

    public String getBadgeCode() {
        return badgeCode;
    }

    public void setBadgeCode(String badgeCode) {
        this.badgeCode = badgeCode;
    }

    public String getBadgeType() {
        return badgeType;
    }

    public void setBadgeType(String badgeType) {
        this.badgeType = badgeType;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }
}
