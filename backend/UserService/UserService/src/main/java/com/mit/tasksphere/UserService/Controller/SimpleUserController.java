package com.mit.tasksphere.UserService.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mit.tasksphere.UserService.Entities.User;
import com.mit.tasksphere.UserService.Services.UserService;

@RestController
//@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class SimpleUserController {

    @Autowired
    private UserService userService;

    @GetMapping("/api/users/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("CORS working");
    }

    @PostMapping("/api/users/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            return ResponseEntity.ok().body(java.util.Map.of(
                "message", "User registered successfully",
                "userId", registeredUser.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}