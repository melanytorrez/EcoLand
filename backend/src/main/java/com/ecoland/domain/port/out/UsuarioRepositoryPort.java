package com.ecoland.domain.port.out;

import com.ecoland.domain.model.Usuario;
import java.util.Optional;

public interface UsuarioRepositoryPort {
    Optional<Usuario> findById(Long id);
    Optional<Usuario> findByEmail(String email);
    Usuario save(Usuario usuario);
    void deleteById(Long id);
}
