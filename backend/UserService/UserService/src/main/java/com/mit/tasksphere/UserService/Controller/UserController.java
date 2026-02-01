package com.mit.tasksphere.UserService.Controller;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mit.tasksphere.UserService.Entities.User;
import com.mit.tasksphere.UserService.Repository.UserRepository;
import com.mit.tasksphere.UserService.Security.JwtHelper;
import com.mit.tasksphere.UserService.Services.UserService;
import com.mit.tasksphere.UserService.PayLoads.JwtResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.http.ResponseEntity;

//@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081", "http://localhost:5173", "http://localhost:3000"})
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsService customUserDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private User getUserFromJwt(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Missing or invalid Authorization header");
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtHelper.extractUsername(token); // assumes email is username
        logger.info("Extracted email from token: {}", email);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }


    @GetMapping("/api/users/current")
    public User getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        // SIMPLIFIED: Only JWT-based auth since Gateway headers are disabled
        User user = getUserFromJwt(authHeader);
        logger.info("Fetching current user from JWT token: {}", user.getEmail());
        return user;
    }

    @GetMapping("/users/me")
    public User currentUser(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromJwt(authHeader);
        logger.info("Fetching current user from token: {}", user.getEmail());
        return user;
    }

//    @GetMapping("/getusers")
//    public List<User> getUsersLegacy(@RequestHeader("Authorization") String authHeader) {
//        // Legacy endpoint - keeping for backward compatibility
//        User user = getUserFromJwt(authHeader);
//        logger.info("Admin {} is fetching all users via legacy endpoint", user.getEmail());
//        return userService.getUser();
//    }

    @GetMapping("/getusers")
    public ResponseEntity<List<User>> getUsers(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader != null) {
                User user = getUserFromJwt(authHeader);
                logger.info("User {} is fetching all users", user.getEmail());
            }
            return ResponseEntity.ok(userService.getUser());
        } catch (Exception e) {
            logger.error("Error fetching users: {}", e.getMessage());
            return ResponseEntity.ok(userService.getUser()); // Return users anyway
        }
    }

    @PutMapping("/users/update")
    public User updateUser(@RequestBody User updatedUserData, @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromJwt(authHeader);
        logger.info("User {} is updating their profile", user.getEmail());
       
        return userService.updateUser(user.getEmail(),updatedUserData);
    }

    @DeleteMapping("/users/delete")
    public User deleteUser(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromJwt(authHeader);
        logger.info("User {} requested deletion", user.getEmail());
        return userService.deleteUser(user);
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        User requester = getUserFromJwt(authHeader);
        logger.info("User {} is fetching user by ID: {}", requester.getEmail(), id);
        return userService.getUserById(id);
    }

    @GetMapping("/users/role")
    public List<User> getUserByRole(@RequestParam String role, @RequestHeader("Authorization") String authHeader) {
        User requester = getUserFromJwt(authHeader);
        logger.info("User {} is fetching users with role: {}", requester.getEmail(), role);
        return userService.getUserByRole(role);
    }
}
