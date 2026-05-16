package com.mascotasperdidas.controller;

import com.mascotasperdidas.dto.request.ContactRequest;
import com.mascotasperdidas.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Void> sendMessage(@Valid @RequestBody ContactRequest request) {
        contactService.saveMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
