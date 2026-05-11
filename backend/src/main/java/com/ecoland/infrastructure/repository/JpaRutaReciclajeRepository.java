package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.RutaReciclajeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaRutaReciclajeRepository extends JpaRepository<RutaReciclajeEntity, Long> {
}
