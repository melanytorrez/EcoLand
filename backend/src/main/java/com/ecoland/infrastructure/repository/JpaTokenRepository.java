package com.ecoland.infrastructure.repository;

import com.ecoland.infrastructure.entity.TokenSesionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JpaTokenRepository extends JpaRepository<TokenSesionEntity, Long> {
    Optional<TokenSesionEntity> findByToken(String token);
    void deleteByToken(String token);
}
