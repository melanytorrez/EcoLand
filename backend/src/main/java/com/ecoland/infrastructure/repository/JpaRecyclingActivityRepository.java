package com.ecoland.infrastructure.repository;

import com.ecoland.domain.model.RecyclingActivityStatus;
import com.ecoland.infrastructure.entity.RecyclingActivityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaRecyclingActivityRepository extends JpaRepository<RecyclingActivityEntity, Long> {
    List<RecyclingActivityEntity> findByStatusOrderByRegisteredAtDesc(RecyclingActivityStatus status);

    List<RecyclingActivityEntity> findByUsuarioEmailOrderByRegisteredAtDesc(String usuarioEmail);

    long countByUsuarioEmailAndStatus(String usuarioEmail, RecyclingActivityStatus status);
}
