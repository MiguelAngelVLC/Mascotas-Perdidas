package com.mascotasperdidas.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "El email o nombre de usuario es requerido")
    private String usernameOrEmail;

    @NotBlank(message = "La contraseña es requerida")
    private String password;
}
