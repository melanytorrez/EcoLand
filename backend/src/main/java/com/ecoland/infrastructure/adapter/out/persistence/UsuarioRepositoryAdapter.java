package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.repository.JpaUsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioRepositoryAdapter.class);

    private final JpaUsuarioRepository jpaUsuarioRepository;

    public UsuarioRepositoryAdapter(JpaUsuarioRepository jpaUsuarioRepository) {
        this.jpaUsuarioRepository = jpaUsuarioRepository;
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        try {
            Optional<Usuario> usuario = jpaUsuarioRepository.findById(id).map(this::toDomain);
            if (usuario.isEmpty()) {
                logger.warn("Database query returned no user for id={}", id);
            }
            return usuario;
        } catch (TransientDataAccessException ex) {
            logger.error("SQL transient error while querying user by id={}", id, ex);
            throw ex;
        } catch (DataAccessException ex) {
            logger.error("Database access error while querying user by id={}", id, ex);
            throw ex;
        }
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        try {
            Optional<Usuario> usuario = jpaUsuarioRepository.findByEmail(email).map(this::toDomain);
            if (usuario.isEmpty()) {
                logger.warn("Database query returned no user for email={}", email);
            }
            return usuario;
        } catch (TransientDataAccessException ex) {
            logger.error("SQL transient error while querying user by email={}", email, ex);
            throw ex;
        } catch (DataAccessException ex) {
            logger.error("Database access error while querying user by email={}", email, ex);
            throw ex;
        }
    }

    @Override
    public Usuario save(Usuario usuario) {
        try {
            UsuarioEntity entity = toEntity(usuario);
            UsuarioEntity saved = jpaUsuarioRepository.save(entity);

            logger.info(
                "AUDIT DB: user persisted successfully (userId={}, email={})",
                saved.getId(),
                saved.getEmail()
            );

            return toDomain(saved);
        } catch (TransientDataAccessException ex) {
            logger.error("SQL transient error while saving user with id={}", usuario.getId(), ex);
            throw ex;
        } catch (DataAccessException ex) {
            logger.error("Database access error while saving user with id={}", usuario.getId(), ex);
            throw ex;
        }
    }

    @Override
    public void deleteById(Long id) {
        jpaUsuarioRepository.deleteById(id);
    }

    private Usuario toDomain(UsuarioEntity entity) {
        var roles = entity.getRoles() == null ? Collections.<Rol>emptySet() :
            entity.getRoles().stream()
                .map(r -> new Rol(r.getId(), r.getNombre()))
                .collect(Collectors.toSet());

        return new Usuario(
            entity.getId(),
            entity.getNombre(),
            entity.getEmail(),
            entity.getPassword(),
            roles
        );
    }

    private UsuarioEntity toEntity(Usuario usuario) {
        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(usuario.getId());
        entity.setNombre(usuario.getNombre());
        entity.setEmail(usuario.getEmail());
        entity.setPassword(usuario.getPassword());
        if (usuario.getRoles() != null) {
            entity.setRoles(usuario.getRoles().stream()
                .map(r -> new RolEntity(r.getId(), r.getNombre()))
                .collect(Collectors.toSet()));
        }
        return entity;
    }
}
