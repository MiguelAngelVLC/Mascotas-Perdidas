package com.mascotasperdidas.service;

import com.mascotasperdidas.dto.request.ReportRequest;
import com.mascotasperdidas.dto.response.ReportResponse;
import com.mascotasperdidas.entity.Report;
import com.mascotasperdidas.entity.ReportImage;
import com.mascotasperdidas.entity.User;
import com.mascotasperdidas.exception.ForbiddenException;
import com.mascotasperdidas.exception.ResourceNotFoundException;
import com.mascotasperdidas.repository.ReportRepository;
import com.mascotasperdidas.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public Page<ReportResponse> getReports(String status, String animalType, String city, String q,
                                            int page, int size, HttpServletRequest request) {
        Report.Status statusEnum = parseEnum(Report.Status.class, status);
        Report.AnimalType typeEnum = parseEnum(Report.AnimalType.class, animalType);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String baseUrl = getBaseUrl(request);
        return reportRepository.findFiltered(statusEnum, typeEnum, city, q, pageable)
            .map(r -> ReportResponse.from(r, baseUrl));
    }

    @Transactional(readOnly = true)
    public ReportResponse getById(Long id, HttpServletRequest request) {
        Report report = reportRepository.findById(id)
            .filter(Report::isActive)
            .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado: " + id));
        return ReportResponse.from(report, getBaseUrl(request));
    }

    @Transactional
    public ReportResponse create(ReportRequest req, MultipartFile image, String username,
                                  HttpServletRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Report report = new Report();
        mapToEntity(req, report);
        report.setPublishedBy(user);

        if (image != null && !image.isEmpty()) {
            String filename = storageService.store(image);
            report.getImages().add(new ReportImage(report, filename, true));
        }

        reportRepository.save(report);
        return ReportResponse.from(report, getBaseUrl(request));
    }

    @Transactional
    public ReportResponse update(Long id, ReportRequest req, MultipartFile image,
                                  String username, HttpServletRequest request) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado: " + id));

        if (!report.getPublishedBy().getUsername().equals(username)) {
            User user = userRepository.findByUsername(username).orElseThrow();
            boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
            if (!isAdmin) throw new ForbiddenException("No tienes permiso para editar este reporte");
        }

        mapToEntity(req, report);

        if (image != null && !image.isEmpty()) {
            report.getImages().stream().filter(ReportImage::isPrimary).findFirst().ifPresent(old -> {
                storageService.delete(old.getFilename());
                report.getImages().remove(old);
            });
            String filename = storageService.store(image);
            report.getImages().add(new ReportImage(report, filename, true));
        }

        reportRepository.save(report);
        return ReportResponse.from(report, getBaseUrl(request));
    }

    @Transactional
    public void delete(Long id, String username) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado: " + id));
        if (!report.getPublishedBy().getUsername().equals(username)) {
            User user = userRepository.findByUsername(username).orElseThrow();
            boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
            if (!isAdmin) throw new ForbiddenException("No tienes permiso para eliminar este reporte");
        }
        report.getImages().forEach(img -> storageService.delete(img.getFilename()));
        report.setActive(false);
        reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getMyReports(String username, int page, int size, HttpServletRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reportRepository.findByPublishedByIdAndActiveTrue(user.getId(), pageable)
            .map(r -> ReportResponse.from(r, getBaseUrl(request)));
    }

    private void mapToEntity(ReportRequest req, Report report) {
        report.setStatus(req.getStatus());
        report.setAnimalType(req.getAnimalType());
        report.setName(req.getName());
        report.setBreed(req.getBreed());
        report.setColor(req.getColor());
        report.setSize(req.getSize());
        report.setEventDate(req.getEventDate());
        report.setDescription(req.getDescription());
        report.setDistinctiveFeatures(req.getDistinctiveFeatures());
        report.setLocationText(req.getLocationText());
        report.setCity(req.getCity());
        report.setProvince(req.getProvince());
        report.setContactName(req.getContactName());
        report.setContactPhone(req.getContactPhone());
        report.setContactEmail(req.getContactEmail());
    }

    private <E extends Enum<E>> E parseEnum(Class<E> clazz, String value) {
        if (value == null || value.isBlank()) return null;
        try { return Enum.valueOf(clazz, value.toUpperCase()); }
        catch (IllegalArgumentException e) { return null; }
    }

    private String getBaseUrl(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }
}
