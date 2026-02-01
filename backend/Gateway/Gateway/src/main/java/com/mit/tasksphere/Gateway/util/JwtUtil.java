package com.mit.tasksphere.Gateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.issuer}")
    private String issuer;

    private SecretKey key;

    @PostConstruct
    public void init() {
        if (secret == null ) {
            throw new IllegalStateException(
                "JWT secret must be at least 256 bits (32 characters)"
            );
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /* ================= CORE VALIDATION ================= */

    public boolean validateToken(String token) {
        try {
            Claims claims = extractAllClaims(token);

            // only ACCESS tokens allowed
            if (!"ACCESS".equals(claims.get("token_type", String.class))) {
                return false;
            }

            // explicit expiration check
            return !isTokenExpired(claims);

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .requireIssuer(issuer)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /* ================= CLAIM HELPERS ================= */

    public String extractUsername(String token) {
        try {
            return extractAllClaims(token).getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    public String extractUserId(String token) {
        try {
            return extractAllClaims(token).get("userId", String.class);
        } catch (JwtException e) {
            return null;
        }
    }

    public String extractEmail(String token) {
        try {
            return extractAllClaims(token).get("email", String.class);
        } catch (JwtException e) {
            return null;
        }
    }

    public String extractRoles(String token) {
        try {
            return extractAllClaims(token).get("roles", String.class);
        } catch (JwtException e) {
            return null;
        }
    }

    /* ================= UTIL ================= */

    private boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        return expiration != null && expiration.before(new Date());
    }
}
