package com.mascotasperdidas.service;

import com.mascotasperdidas.dto.response.UserResponse;
import com.mascotasperdidas.entity.User;
import com.mascotasperdidas.exception.ResourceNotFoundException;
import com.mascotasperdidas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
        return UserResponse.from(user);
    }
}
