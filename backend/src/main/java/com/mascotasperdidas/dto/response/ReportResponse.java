package com.mascotasperdidas.dto.response;

import com.mascotasperdidas.entity.Report;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ReportResponse {
    private Long id;
    private String status;
    private String animalType;
    private String name;
    private String breed;
    private String color;
    private String size;
    private LocalDate eventDate;
    private String description;
    private String distinctiveFeatures;
    private String locationText;
    private String city;
    private String province;
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private Long publishedById;
    private String publishedByUsername;
    private List<String> imageUrls;
    private String primaryImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReportResponse from(Report report, String baseUrl) {
        ReportResponse dto = new ReportResponse();
        dto.setId(report.getId());
        dto.setStatus(report.getStatus().name());
        dto.setAnimalType(report.getAnimalType().name());
        dto.setName(report.getName());
        dto.setBreed(report.getBreed());
        dto.setColor(report.getColor());
        dto.setSize(report.getSize() != null ? report.getSize().name() : null);
        dto.setEventDate(report.getEventDate());
        dto.setDescription(report.getDescription());
        dto.setDistinctiveFeatures(report.getDistinctiveFeatures());
        dto.setLocationText(report.getLocationText());
        dto.setCity(report.getCity());
        dto.setProvince(report.getProvince());
        dto.setContactName(report.getContactName());
        dto.setContactPhone(report.getContactPhone());
        dto.setContactEmail(report.getContactEmail());
        if (report.getPublishedBy() != null) {
            dto.setPublishedById(report.getPublishedBy().getId());
            dto.setPublishedByUsername(report.getPublishedBy().getUsername());
        }
        List<String> urls = report.getImages().stream()
            .map(img -> baseUrl + "/api/uploads/" + img.getFilename())
            .collect(Collectors.toList());
        dto.setImageUrls(urls);
        dto.setPrimaryImageUrl(report.getImages().stream()
            .filter(img -> img.isPrimary())
            .findFirst()
            .map(img -> baseUrl + "/api/uploads/" + img.getFilename())
            .orElse(urls.isEmpty() ? null : urls.get(0)));
        dto.setCreatedAt(report.getCreatedAt());
        dto.setUpdatedAt(report.getUpdatedAt());
        return dto;
    }
}
