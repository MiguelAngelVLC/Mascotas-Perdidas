package com.mascotasperdidas.service;

import com.mascotasperdidas.dto.request.LoginRequest;
import com.mascotasperdidas.dto.request.RegisterRequest;
import com.mascotasperdidas.dto.response.AuthResponse;
import com.mascotasperdidas.dto.response.UserResponse;
import com.mascotasperdidas.entity.Role;
import com.mascotasperdidas.entity.User;
import com.mascotasperdidas.exception.BadRequestException;
import com.mascotasperdidas.repository.RoleRepository;
import com.mascotasperdidas.repository.UserRepository;
import com.mascotasperdidas.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public UserResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new BadRequestException("El email ya está registrado");
        if (userRepository.existsByUsername(req.getUsername()))
            throw new BadRequestException("El nombre de usuario ya está en uso");

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());

        Role userRole = roleRepository.findByName("ROLE_USER")
            .orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));
        user.getRoles().add(userRole);

        userRepository.save(user);
        return UserResponse.from(user);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsernameOrEmail(), req.getPassword())
        );
        String token = jwtUtils.generateToken(auth);
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return new AuthResponse(token, UserResponse.from(user));
    }
}
