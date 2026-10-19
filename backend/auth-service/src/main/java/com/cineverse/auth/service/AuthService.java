package com.cineverse.auth.service;

import com.cineverse.auth.dto.AuthResponse;
import com.cineverse.auth.dto.LoginRequest;
import com.cineverse.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(String email);
}
