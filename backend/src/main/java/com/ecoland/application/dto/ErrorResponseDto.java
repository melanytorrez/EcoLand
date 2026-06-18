package com.ecoland.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Estructura estándar para respuestas de error")
public class ErrorResponseDto {

    @Schema(description = "Mensaje descriptivo del error", example = "El recurso solicitado no fue encontrado")
    private String message;

    public ErrorResponseDto() {}

    public ErrorResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
