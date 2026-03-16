package com.ecoland.domain.port.out;

import com.ecoland.domain.model.Rol;
import java.util.Optional;

public interface RolRepositoryPort {
    Optional<Rol> findByNombre(String nombre);
    Rol save(Rol rol);
}
