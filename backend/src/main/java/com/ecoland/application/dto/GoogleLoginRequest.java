package com.ecoland.application.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {
    
    @NotBlank(message = "El token de Google es requerido")
    private String tokenId;

    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String tokenId) {
        this.tokenId = tokenId;
    }

    public String getTokenId() {
        return tokenId;
    }

    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;
    }
}
