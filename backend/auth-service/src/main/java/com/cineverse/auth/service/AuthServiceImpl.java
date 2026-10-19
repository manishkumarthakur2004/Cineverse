package com.cineverse.auth.service;

import com.cineverse.auth.dto.AuthResponse;
import com.cineverse.auth.dto.LoginRequest;
import com.cineverse.auth.dto.RegisterRequest;
import com.cineverse.auth.dto.UserResponse;
import com.cineverse.auth.entity.RefreshToken;
import com.cineverse.auth.entity.Role;
import com.cineverse.auth.entity.User;
import com.cineverse.common.enums.RoleType;
import com.cineverse.common.exception.BadRequestException;
import com.cineverse.common.exception.ResourceNotFoundException;
import com.cineverse.common.exception.UnauthorizedException;
import com.cineverse.auth.repository.RefreshTokenRepository;
import com.cineverse.auth.repository.RoleRepository;
import com.cineverse.auth.repository.UserRepository;
import com.cineverse.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing registration request for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        Role userRole = roleRepository.findByName(RoleType.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Default Role ROLE_USER not found"));

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(userRole))
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());

        String accessToken = generateAccessToken(savedUser);
        RefreshToken refreshToken = createRefreshToken(savedUser);

        return buildAuthResponse(savedUser, accessToken, refreshToken.getToken());
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login request for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        log.info("User authenticated successfully: {}", user.getEmail());

        String accessToken = generateAccessToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken.getToken());
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String token) {
        log.info("Processing token refresh request");

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token was expired. Please sign in again");
        }

        User user = refreshToken.getUser();
        
        // Rotate refresh token
        refreshTokenRepository.delete(refreshToken);
        RefreshToken newRefreshToken = createRefreshToken(user);
        String newAccessToken = generateAccessToken(user);

        return buildAuthResponse(user, newAccessToken, newRefreshToken.getToken());
    }

    @Override
    @Transactional
    public void logout(String email) {
        log.info("Logging out user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        refreshTokenRepository.deleteByUser(user);
    }

    private String generateAccessToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId().toString());
        extraClaims.put("roles", user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList()));

        return jwtService.generateToken(user.getEmail(), extraClaims);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(RefreshToken.builder().user(user).build());

        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roleNames)
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userResponse)
                .build();
    }
}
