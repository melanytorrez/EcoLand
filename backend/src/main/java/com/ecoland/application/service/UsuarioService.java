package com.ecoland.application.service;

import com.ecoland.domain.model.Usuario;
import com.ecoland.domain.port.in.UsuarioUseCase;
import com.ecoland.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService implements UsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;

    public UsuarioService(UsuarioRepositoryPort usuarioRepositoryPort) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
    }

    @Override
    public Optional<Usuario> getUsuarioById(Long id) {
        return usuarioRepositoryPort.findById(id);
    }

    @Override
    public Optional<Usuario> getUsuarioByEmail(String email) {
        return usuarioRepositoryPort.findByEmail(email);
    }

    @Override
    public Usuario createUsuario(Usuario usuario) {
        return usuarioRepositoryPort.save(usuario);
    }

    @Override
    public void deleteUsuario(Long id) {
        usuarioRepositoryPort.deleteById(id);
    }
}
