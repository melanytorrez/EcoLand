package com.ecoland.infrastructure.config;

/**
 * Clase centralizada de constantes para el backend de EcoLand.
 * Incluye límites del sistema, configuraciones de seguridad y mensajes globales.
 */
public final class AppConstants {

    private AppConstants() {
        // Constructor privado para evitar instanciación
    }

    // --- SEGURIDAD ---
    public static final long TOKEN_EXPIRATION_TIME = 86400000; // 24 horas en milisegundos
    public static final int PASSWORD_MIN_LENGTH = 8;

    // --- CAMPAÑAS DE REFORESTACIÓN ---
    public static final int MAX_CAMPAIGN_TITLE_LENGTH = 100;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_SPOTS_ALLOWED = 1000;

    // --- ROLES DEL SISTEMA ---
    public static final String ROLE_ADMIN = "ADMINISTRADOR";
    public static final String ROLE_USER = "USUARIO";

    // --- MENSAJES DE ERROR COMUNES ---
    public static final String MSG_USER_NOT_FOUND = "Usuario no encontrado";
    public static final String MSG_CAMPAIGN_NOT_FOUND = "Campaña no encontrada";
}
