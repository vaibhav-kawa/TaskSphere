package com.mit.tasksphere.TaskService.Config;

//import com.mit.tasksphere.TaskService.Filter.HeaderAuthenticationFilter;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

//@Configuration
public class SecurityConfig {

//    // COMMENTED OUT: Filter expects Gateway headers that are no longer provided
//    // @Autowired
//    // private HeaderAuthenticationFilter headerAuthenticationFilter;
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        return http
//            .csrf(csrf -> csrf.disable())
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/actuator/**").permitAll()
//                // Temporarily allow all requests to fix dashboard loading
//                .anyRequest().permitAll()
//            )
//            // COMMENTED OUT: Filter rejects requests without Gateway headers
//            // .addFilterBefore(headerAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
//            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//            .build();
//    }
}