package com.ecoland.domain.port.in;

import com.ecoland.application.dto.AuthResponse;
import com.ecoland.application.dto.LoginRequest;
import com.ecoland.application.dto.RegisterRequest;

public interface AuthUseCase {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
