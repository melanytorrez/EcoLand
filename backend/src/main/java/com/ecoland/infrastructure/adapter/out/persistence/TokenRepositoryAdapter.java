package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.TokenSesion;
import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.port.out.TokenRepositoryPort;
import com.ecoland.infrastructure.entity.TokenSesionEntity;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.repository.JpaTokenRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class TokenRepositoryAdapter implements TokenRepositoryPort {

    private final JpaTokenRepository jpaTokenRepository;

    public TokenRepositoryAdapter(JpaTokenRepository jpaTokenRepository) {
        this.jpaTokenRepository = jpaTokenRepository;
    }

    @Override
    public Optional<TokenSesion> findByToken(String token) {
        return jpaTokenRepository.findByToken(token).map(this::toDomain);
    }

    @Override
    public TokenSesion save(TokenSesion tokenSesion) {
        return toDomain(jpaTokenRepository.save(toEntity(tokenSesion)));
    }

    @Override
    public void deleteByToken(String token) {
        jpaTokenRepository.deleteByToken(token);
    }

    private TokenSesion toDomain(TokenSesionEntity entity) {
        Long usuarioId = entity.getUsuario() != null ? entity.getUsuario().getId() : null;
        return new TokenSesion(entity.getId(), entity.getToken(), entity.getFechaExpiracion(), usuarioId);
    }

    private TokenSesionEntity toEntity(TokenSesion tokenSesion) {
        TokenSesionEntity entity = new TokenSesionEntity();
        entity.setId(tokenSesion.getId());
        entity.setToken(tokenSesion.getToken());
        entity.setFechaExpiracion(tokenSesion.getFechaExpiracion());
        
        if (tokenSesion.getUsuarioId() != null) {
            UsuarioEntity userEntity = new UsuarioEntity();
            userEntity.setId(tokenSesion.getUsuarioId());
            entity.setUsuario(userEntity);
        }
        
        return entity;
    }
}
