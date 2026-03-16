package com.ecoland.domain.port.in;

import com.ecoland.application.dto.AuthResponse;
import com.ecoland.domain.model.Usuario;

public interface AuthUseCase {
    AuthResponse login(String email, String password);
    AuthResponse register(Usuario usuario);
}
