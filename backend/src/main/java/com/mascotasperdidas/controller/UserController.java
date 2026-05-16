package com.mascotasperdidas.controller;

import com.mascotasperdidas.dto.response.ReportResponse;
import com.mascotasperdidas.dto.response.UserResponse;
import com.mascotasperdidas.service.ReportService;
import com.mascotasperdidas.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ReportService reportService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getByUsername(userDetails.getUsername()));
    }

    @GetMapping("/me/reports")
    public ResponseEntity<Page<ReportResponse>> getMyReports(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size,
        HttpServletRequest request
    ) {
        return ResponseEntity.ok(reportService.getMyReports(userDetails.getUsername(), page, size, request));
    }
}
