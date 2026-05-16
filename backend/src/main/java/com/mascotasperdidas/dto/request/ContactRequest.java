package com.mascotasperdidas.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ContactRequest {

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 120)
    private String name;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email no es válido")
    private String email;

    @Size(max = 200)
    private String subject;

    @NotBlank(message = "El mensaje es requerido")
    @Size(min = 10, max = 2000, message = "El mensaje debe tener entre 10 y 2000 caracteres")
    private String message;
}
