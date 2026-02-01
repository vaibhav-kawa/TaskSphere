package com.mit.tasksphere.UserService.Controller;

import com.mit.tasksphere.UserService.Services.OAuthService;
import com.mit.tasksphere.UserService.PayLoads.JwtResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/oauth2")
//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081", "http://localhost:5173", "http://localhost:3000"})
public class OAuthController {

    @Autowired
    private OAuthService oAuthService;

    @GetMapping("/callback/google")
    public ResponseEntity<JwtResponse> googleCallback(@RequestParam String code) {
        JwtResponse response = oAuthService.processGoogleCallback(code);
        return ResponseEntity.ok(response);
    }
}