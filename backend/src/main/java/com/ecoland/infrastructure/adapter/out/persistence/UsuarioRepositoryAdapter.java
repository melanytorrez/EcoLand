package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.model.Rol;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.repository.JpaUsuarioRepository;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;
import com.ecoland.domain.model.EstadoSolicitud;

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

    @Override
    public List<Usuario> findByEstadoSolicitud(EstadoSolicitud estadoSolicitud) {
        return jpaUsuarioRepository.findByEstadoSolicitud(estadoSolicitud)
            .stream()
            .map(this::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<Usuario> findAll() {
        return jpaUsuarioRepository.findAll()
            .stream()
            .map(this::toDomain)
            .collect(Collectors.toList());
    }

    private Usuario toDomain(UsuarioEntity entity) {
        var roles = entity.getRoles() == null ? Collections.<Rol>emptySet() :
            entity.getRoles().stream()
                .map(r -> new Rol(r.getId(), r.getNombre()))
                .collect(Collectors.toSet());

        Usuario usuario = new Usuario(
            entity.getId(),
            entity.getNombre(),
            entity.getEmail(),
            entity.getPassword(),
            roles,
            entity.getEstadoSolicitud()
        );
        usuario.setMotivation(entity.getMotivation());
        usuario.setPlans(entity.getPlans());
        usuario.setExperience(entity.getExperience());
        usuario.setCommitment(entity.getCommitment());
        usuario.setContact(entity.getContact());
        usuario.setZone(entity.getZone());
        usuario.setOrganization(entity.getOrganization());
        usuario.setFechaSolicitud(entity.getFechaSolicitud());
        return usuario;
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
        entity.setEstadoSolicitud(usuario.getEstadoSolicitud());
        entity.setMotivation(usuario.getMotivation());
        entity.setPlans(usuario.getPlans());
        entity.setExperience(usuario.getExperience());
        entity.setCommitment(usuario.getCommitment());
        entity.setContact(usuario.getContact());
        entity.setZone(usuario.getZone());
        entity.setOrganization(usuario.getOrganization());
        entity.setFechaSolicitud(usuario.getFechaSolicitud());
        return entity;
    }
}
