package com.cineverse.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    public static class Config {
        // No custom config parameters needed for MVP
    }

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // Strip client-supplied security headers to prevent spoofing
            if (request.getHeaders().containsKey("X-User-Email") || request.getHeaders().containsKey("X-User-Roles")) {
                request = request.mutate()
                        .headers(httpHeaders -> {
                            httpHeaders.remove("X-User-Email");
                            httpHeaders.remove("X-User-Roles");
                        })
                        .build();
                exchange = exchange.mutate().request(request).build();
            }

            // 1. Exclude public paths from JWT verification
            if (isPublicPath(request.getURI().getPath())) {
                return chain.filter(exchange);
            }

            // 2. Validate presence of Authorization header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid Authorization Header format", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            try {
                // 3. Verify and parse JWT
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                // 4. Inject claims (username/email and roles) into downstream headers
                ServerHttpRequest mutatedRequest = request.mutate()
                        .header("X-User-Email", claims.getSubject())
                        .header("X-User-Roles", String.valueOf(claims.get("roles")))
                        .build();

                return chain.filter(exchange.mutate().request(mutatedRequest).build());

            } catch (Exception e) {
                return onError(exchange, "Invalid or expired JWT Token", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private boolean isPublicPath(String path) {
        List<String> publicEndpoints = List.of(
                "/api/v1/auth/register",
                "/api/v1/auth/login",
                "/api/v1/auth/refresh",
                "/api/v1/auth/logout"
        );
        return publicEndpoints.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }
}
