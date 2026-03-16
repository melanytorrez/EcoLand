package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.AuditoriaLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaAuditoriaRepository extends JpaRepository<AuditoriaLogEntity, Long> {
}
