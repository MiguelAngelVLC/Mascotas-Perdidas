package com.mascotasperdidas.controller;

import com.mascotasperdidas.dto.request.ReportRequest;
import com.mascotasperdidas.dto.response.ReportResponse;
import com.mascotasperdidas.service.ReportService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<Page<ReportResponse>> getAll(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String animalType,
        @RequestParam(required = false) String city,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size,
        HttpServletRequest request
    ) {
        return ResponseEntity.ok(reportService.getReports(status, animalType, city, q, page, size, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getById(@PathVariable Long id, HttpServletRequest request) {
        return ResponseEntity.ok(reportService.getById(id, request));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> create(
        @Valid @ModelAttribute ReportRequest reportRequest,
        @RequestPart(value = "image", required = false) MultipartFile image,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(reportService.create(reportRequest, image, userDetails.getUsername(), request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> update(
        @PathVariable Long id,
        @Valid @ModelAttribute ReportRequest reportRequest,
        @RequestPart(value = "image", required = false) MultipartFile image,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest request
    ) {
        return ResponseEntity.ok(reportService.update(id, reportRequest, image, userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        reportService.delete(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
