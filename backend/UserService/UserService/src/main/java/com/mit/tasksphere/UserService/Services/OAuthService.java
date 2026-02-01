package com.mit.tasksphere.UserService.Services;

import com.mit.tasksphere.UserService.Entities.User;
import com.mit.tasksphere.UserService.PayLoads.JwtResponse;
import com.mit.tasksphere.UserService.Repository.UserRepository;
import com.mit.tasksphere.UserService.Security.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class OAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri:http://localhost:8082/api/auth/oauth2/callback/google}")
    private String redirectUri;

    public JwtResponse processGoogleCallback(String code) {
        try {
            // SECURITY: Exchange authorization code for access token (internal only)
            String accessToken = exchangeCodeForToken(code);
            
            // SECURITY: Get user info from Google (internal only)
            Map<String, Object> userInfo = getUserInfoFromGoogle(accessToken);
            
            // SECURITY: Find or create internal user
            User user = findOrCreateUser(userInfo);
            
            // SECURITY: Generate INTERNAL JWT only - Google tokens never exposed
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String internalJwt = jwtHelper.generateToken(userDetails, user);
            
            // SECURITY: Return only internal JWT - same structure as normal login
            return new JwtResponse(internalJwt, user.getName(), user.getId());
            
        } catch (Exception e) {
            // SECURITY: Never expose OAuth errors to client
            throw new RuntimeException("OAuth authentication failed");
        }
    }

    private String exchangeCodeForToken(String code) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("client_id", googleClientId);
            params.add("client_secret", googleClientSecret);
            params.add("code", code);
            params.add("grant_type", "authorization_code");
            params.add("redirect_uri", redirectUri);
            
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://oauth2.googleapis.com/token", request, Map.class);
            
            // SECURITY: Google access token stays internal - never exposed
            return (String) response.getBody().get("access_token");
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to exchange OAuth code");
        }
    }

    private Map<String, Object> getUserInfoFromGoogle(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            HttpMethod.GET, entity, Map.class);
        
        return response.getBody();
    }

    private User findOrCreateUser(Map<String, Object> userInfo) {
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");
        
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            return existingUser.get();
        }
        
        // Create new user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setRole("USER"); // Default role
        newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password for OAuth users
        
        return userRepository.save(newUser);
    }
}