package com.ecoland.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {

    private String nombre;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Debe ser un correo electrónico válido")
    private String email;

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*_\\-]).{8,}$",
             message = "La contraseña debe tener al menos 8 caracteres, un número, una letra minúscula, una mayúscula y un carácter especial")
    private String password;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}