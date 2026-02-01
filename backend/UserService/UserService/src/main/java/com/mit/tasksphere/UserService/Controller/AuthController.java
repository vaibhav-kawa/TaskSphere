package com.mit.tasksphere.UserService.Controller;

import jakarta.mail.MessagingException;

import jakarta.mail.internet.MimeMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.naming.AuthenticationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.mit.tasksphere.UserService.Security.JwtHelper;
import com.mit.tasksphere.UserService.Entities.User; // Ensure User is imported
import com.mit.tasksphere.UserService.Services.AttendanceService;
import com.mit.tasksphere.UserService.Services.EmailService; 
import com.mit.tasksphere.UserService.PayLoads.JwtResponse; 
import com.mit.tasksphere.UserService.PayLoads.LoginRequest; 


import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@RestController
public class AuthController {

	@Autowired
	private UserDetailsService customUserDetailsService;
	
	@Autowired
	private AttendanceService attendanceService;
    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtHelper helper;

    @Autowired
    private com.mit.tasksphere.UserService.Repository.UserRepository userRepo;

    
    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    

    @Autowired 
    private JavaMailSender javaMailSender;
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @PostMapping({"/api/users/login", "/auth/login"})
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        logger.info("Login attempt for email: {}", request.getEmail());

        try {
            // 1. Check if user exists
            User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

            // 2. Authenticate with AuthenticationManager
            Authentication authentication = manager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 3. Load UserDetails from UserDetailsService
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getEmail());

            // 4. Generate JWT Token with user information
            String token = helper.generateToken(userDetails, user);

            JwtResponse response = new JwtResponse(token, user.getName(), user.getId());
            logger.info("Login successful for: {}", request.getEmail());
            
            attendanceService.logClockIn(user);
            logger.info("Clockin successful for: {}", request.getEmail());
            
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException ex) {
            logger.warn("Login failed: Invalid credentials for {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            logger.error("Unexpected error during login: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed. Please try again."));
        }
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Optional<User> userOpt = userRepo.findByEmail(email);
        String userName;
        
        if (userOpt.isPresent()) {
             userName = userOpt.get().getName(); // Get the user's name
        } else {
        	return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with this email does not exist.");
        }
        
     // Construct the reset link. Make sure this matches your frontend's reset password route.
        String resetLink = "http://localhost:8081/reset-password?email=" + email; // Use your actual domain in production

        String subject = "Reset Your Password - TaskSphere"; // Updated subject

        // The detailed HTML email template (Assuming EmailService handles the content)

        emailService.sendForgotPasswordEmail(email,userName , resetLink);
        return ResponseEntity.status(HttpStatus.OK).body("Reset Link sent successfully");
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
    	logger.info("Reset password request initiated for {}",email);
        Optional<User> userOpt = userRepo.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            logger.info("Password reset successful for {}",email);
            userRepo.save(user);
            return ResponseEntity.ok("Password updated successfully.");
        } else {
        	logger.warn("User dosen't exist with mail: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(@RequestHeader(value="Authorization",required = false) String authHeader) {
    	 if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    	        return ResponseEntity
    	            .status(HttpStatus.UNAUTHORIZED)
    	            .body("Missing or invalid Authorization header");
    	    }
    	 logger.info("Clock out started for : {} " , authHeader);
        try {
            User user = getUserFromJwt(authHeader);
            attendanceService.logClockOut(user);
            logger.info("Clock-Out successful for: {}", user.getId());
            return ResponseEntity.ok("Logged out");
        } catch (Exception e) {
            // HANDLE: Don't fail logout on JWT/attendance errors
            logger.error("Logout error (continuing anyway): {}", e.getMessage());
            return ResponseEntity.ok("Logged out (with warnings)");
        }
    }
    
    private User getUserFromJwt(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Missing or invalid Authorization header");
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = helper.extractUsername(token); // assumes email is username
        logger.info("Token arrived from frotnend {}",token);
        logger.info("Extracted email from token: {}", email);

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex) {
        logger.warn("BadCredentialsException: {}", ex.getMessage());
        return new ResponseEntity<>("Invalid credentials!", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<String> handleUsernameNotFound(UsernameNotFoundException ex) {
        logger.warn("UsernameNotFoundException: {}", ex.getMessage());
        return new ResponseEntity<>("User not found!", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<String> handleNullPointer(NullPointerException ex) {
        logger.error("NullPointerException encountered: ", ex);
        return new ResponseEntity<>("Internal server error: missing data", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException ex) {
        logger.error("RuntimeException encountered: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        logger.error("Unhandled exception: ", ex);
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
}