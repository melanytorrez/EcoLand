package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.UserBadgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaUserBadgeRepository extends JpaRepository<UserBadgeEntity, Long> {

    List<UserBadgeEntity> findByUsuarioEmailOrderByEarnedAtAsc(String usuarioEmail);

    boolean existsByUsuarioEmailAndBadgeCode(String usuarioEmail, String badgeCode);
}
