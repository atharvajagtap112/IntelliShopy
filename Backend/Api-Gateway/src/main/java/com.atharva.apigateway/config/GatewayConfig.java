package com.atharva.apigateway.config;

import jakarta.annotation.PostConstruct;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud. gateway.route.builder.RouteLocatorBuilder;
import org. springframework.context.annotation.Bean;
import org.springframework.context. annotation.Configuration;

@Configuration
public class GatewayConfig {

    @PostConstruct
    public void init() {
        System.out.println("========================================");
        System.out.println("GatewayConfig loaded successfully!");
        System.out.println("========================================");
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        System.out.println("========================================");
        System.out.println("Creating custom routes...");
        System.out. println("========================================");

        return builder.routes()
                .route("auth-service", r -> r
                        .path("/auth/**")
                        .uri("lb://ecommerce"))
                .route("chat-service", r -> r
                        .path("/chat/**")
                        .uri("lb://ecommerce"))
                .route("products-service", r -> r
                        .path("/products/**")
                        . uri("lb://ecommerce"))
                .route("api-service", r -> r
                        . path("/api/**")
                        .uri("lb://ecommerce"))
                .build();
    }
}