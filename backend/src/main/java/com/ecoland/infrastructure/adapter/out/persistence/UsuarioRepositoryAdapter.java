package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.repository.JpaUsuarioRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final JpaUsuarioRepository jpaUsuarioRepository;

    public UsuarioRepositoryAdapter(JpaUsuarioRepository jpaUsuarioRepository) {
        this.jpaUsuarioRepository = jpaUsuarioRepository;
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        return jpaUsuarioRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return jpaUsuarioRepository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity entity = toEntity(usuario);
        return toDomain(jpaUsuarioRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        jpaUsuarioRepository.deleteById(id);
    }

    private Usuario toDomain(UsuarioEntity entity) {
        return new Usuario(
            entity.getId(),
            entity.getNombre(),
            entity.getEmail(),
            entity.getPassword(),
            entity.getRoles().stream()
                .map(r -> new Rol(r.getId(), r.getNombre()))
                .collect(Collectors.toSet())
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
