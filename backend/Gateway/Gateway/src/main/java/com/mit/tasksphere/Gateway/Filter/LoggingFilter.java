package com.mit.tasksphere.Gateway.Filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class LoggingFilter implements GlobalFilter, Ordered {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String traceId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("traceId", traceId);
        
        ServerHttpRequest request = exchange.getRequest();
        
        // Log incoming request
        logger.info("🚀 INCOMING REQUEST: {} {} | Headers: {} | Remote: {} | Time: {}", 
            request.getMethod(), 
            request.getURI(),
            request.getHeaders().toSingleValueMap(),
            request.getRemoteAddress(),
            LocalDateTime.now()
        );
        
        long startTime = System.currentTimeMillis();
        
        return chain.filter(exchange)
            .doOnSuccess(aVoid -> {
                long duration = System.currentTimeMillis() - startTime;
                logger.info("✅ RESPONSE SUCCESS: {} | Duration: {}ms | Status: {} | Time: {}", 
                    request.getURI().getPath(),
                    duration,
                    exchange.getResponse().getStatusCode(),
                    LocalDateTime.now()
                );
            })
            .doOnError(error -> {
                long duration = System.currentTimeMillis() - startTime;
                logger.error("❌ RESPONSE ERROR: {} | Duration: {}ms | Error: {} | Time: {}", 
                    request.getURI().getPath(),
                    duration,
                    error.getMessage(),
                    LocalDateTime.now()
                );
            })
            .doFinally(signalType -> {
                logger.info("🏁 REQUEST COMPLETED: {} | Signal: {} | Time: {}",
                    request.getURI().getPath(),
                    signalType,
                    LocalDateTime.now()
                );
                MDC.clear();
            });
    }
    
    @Override
    public int getOrder() {
        return -1; // Highest priority
    }
}