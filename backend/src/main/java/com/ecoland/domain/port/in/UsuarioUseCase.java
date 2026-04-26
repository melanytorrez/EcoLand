package com.ecoland.domain.port.in;

import com.ecoland.domain.model.Usuario;
import java.util.Optional;

public interface UsuarioUseCase {
    Optional<Usuario> getUsuarioById(Long id);
    Optional<Usuario> getUsuarioByEmail(String email);
    Optional<Usuario> buscarUsuarioPorEmail(String email);
    Usuario createUsuario(Usuario usuario);
    void deleteUsuario(Long id);
    java.util.List<com.ecoland.domain.model.Campaign> getParticipacionesCompletas(String email);
}
