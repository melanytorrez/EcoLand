package com.ecoland.domain.port.out;

import com.ecoland.domain.model.TokenSesion;
import java.util.Optional;

public interface TokenRepositoryPort {
    Optional<TokenSesion> findByToken(String token);
    TokenSesion save(TokenSesion tokenSesion);
    void deleteByToken(String token);
}
