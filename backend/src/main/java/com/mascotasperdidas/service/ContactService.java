package com.mascotasperdidas.service;

import com.mascotasperdidas.dto.request.ContactRequest;
import com.mascotasperdidas.entity.ContactMessage;
import com.mascotasperdidas.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Transactional
    public void saveMessage(ContactRequest req) {
        ContactMessage msg = new ContactMessage();
        msg.setName(req.getName());
        msg.setEmail(req.getEmail());
        msg.setSubject(req.getSubject());
        msg.setMessage(req.getMessage());
        contactMessageRepository.save(msg);
    }
}
