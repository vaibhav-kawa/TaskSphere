package com.mit.tasksphere.TaskService.Filter;

//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.Collections;
//import java.util.List;

//@Component
public class HeaderAuthenticationFilter  {

//    @Override
//    protected void doFilterInternal(HttpServletRequest request, 
//                                  HttpServletResponse response, 
//                                  FilterChain filterChain) throws ServletException, IOException {
//        
//        // SECURITY: Verify request came through Gateway
//        String gatewayAuth = request.getHeader("X-Gateway-Auth");
//        if (!"validated".equals(gatewayAuth)) {
//            // SECURITY: Reject direct requests bypassing Gateway
//            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//            response.getWriter().write("{\"error\":\"Direct access forbidden\",\"message\":\"Requests must go through API Gateway\"}");
//            return;
//        }
//        
//        // SECURITY: Validate required headers from Gateway
//        String userId = request.getHeader("X-User-Id");
//        String email = request.getHeader("X-User-Email");
//        String roles = request.getHeader("X-User-Roles");
//        
//        // SECURITY: Reject requests with missing user context
//        if (userId == null || userId.isEmpty() || email == null || email.isEmpty()) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("{\"error\":\"Missing user context\",\"message\":\"Required user headers not found\"}");
//            return;
//        }
//        
//        // SECURITY: Create authentication from validated Gateway headers
//        UserPrincipal userPrincipal = new UserPrincipal(userId, email, roles);
//        List<SimpleGrantedAuthority> authorities = roles != null ? 
//            Collections.singletonList(new SimpleGrantedAuthority(roles)) : 
//            Collections.emptyList();
//            
//        Authentication auth = new UsernamePasswordAuthenticationToken(
//            userPrincipal, null, authorities);
//        SecurityContextHolder.getContext().setAuthentication(auth);
//        
//        filterChain.doFilter(request, response);
//    }
//
//    // Inner class to hold user principal information
//    public static class UserPrincipal {
//        private final String userId;
//        private final String email;
//        private final String roles;
//
//        public UserPrincipal(String userId, String email, String roles) {
//            this.userId = userId;
//            this.email = email;
//            this.roles = roles;
//        }
//
//        public String getUserId() { return userId; }
//        public String getEmail() { return email; }
//        public String getRoles() { return roles; }
//    }
}