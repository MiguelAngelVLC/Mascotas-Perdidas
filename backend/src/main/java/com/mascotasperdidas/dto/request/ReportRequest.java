package com.mascotasperdidas.dto.request;

import com.mascotasperdidas.entity.Report;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class ReportRequest {

    @NotNull(message = "El estado es requerido (LOST o FOUND)")
    private Report.Status status;

    @NotNull(message = "El tipo de animal es requerido")
    private Report.AnimalType animalType;

    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String name;

    @Size(max = 100, message = "La raza no puede superar 100 caracteres")
    private String breed;

    @Size(max = 100, message = "El color no puede superar 100 caracteres")
    private String color;

    private Report.Size size;

    @NotNull(message = "La fecha del evento es requerida")
    @PastOrPresent(message = "La fecha no puede ser futura")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate eventDate;

    @Size(max = 2000, message = "La descripción no puede superar 2000 caracteres")
    private String description;

    @Size(max = 500, message = "Las características no pueden superar 500 caracteres")
    private String distinctiveFeatures;

    @Size(max = 300, message = "La ubicación no puede superar 300 caracteres")
    private String locationText;

    @Size(max = 100, message = "La ciudad no puede superar 100 caracteres")
    private String city;

    @Size(max = 100, message = "La provincia no puede superar 100 caracteres")
    private String province;

    @NotBlank(message = "El nombre de contacto es requerido")
    @Size(max = 120, message = "El nombre de contacto no puede superar 120 caracteres")
    private String contactName;

    @NotBlank(message = "El teléfono de contacto es requerido")
    @Pattern(regexp = "^\\+?[0-9\\s\\-()]{7,20}$", message = "El teléfono no es válido")
    private String contactPhone;

    @Email(message = "El email de contacto no es válido")
    private String contactEmail;
}
