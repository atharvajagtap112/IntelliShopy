package com.atharva.apigateway.config;

import com.atharva.apigateway.filter.TokenBucketRateLimiterFilter;
import jakarta.annotation.PostConstruct;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.GatewayFilterSpec;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.gateway.route.builder.UriSpec;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    private final TokenBucketRateLimiterFilter tokenBucketRateLimiterFilter;

    public GatewayConfig(TokenBucketRateLimiterFilter tokenBucketRateLimiterFilter) {
        this.tokenBucketRateLimiterFilter = tokenBucketRateLimiterFilter;
    }

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
        System.out.println("========================================");

        return builder.routes()
                .route("auth-service", r -> r
                        .path("/auth/**")
                        .filters(this::sharedFilters)
                        .uri("lb://ecommerce"))
                // The chat route is a WebSocket upgrade, so it deliberately skips
                // sharedFilters. dedupeResponseHeader rewrites response headers,
                // which corrupts the 101 Switching Protocols handshake - the socket
                // opened and then died ~3ms later with close code 1006. Rate
                // limiting and CORS dedupe are meaningless for a socket upgrade
                // anyway; the limiter guards the REST routes that carry the load.
                .route("chat-service", r -> r
                        .path("/chat/**")
                        .uri("lb://ecommerce"))
                .route("products-service", r -> r
                        .path("/products/**")
                        .filters(this::sharedFilters)
                        .uri("lb://ecommerce"))
                .route("api-service", r -> r
                        .path("/api/**")
                        .filters(this::sharedFilters)
                        .uri("lb://ecommerce"))
                .build();
    }

    // Every route: token-bucket rate limiter, then dedupe the CORS headers so the
    // gateway's CorsWebFilter and Primary-Service's CORS config don't both emit them
    // (duplicate Access-Control-Allow-Origin -> browser rejects the response).
    private UriSpec sharedFilters(GatewayFilterSpec f) {
        return f
                .filter(tokenBucketRateLimiterFilter.apply(new TokenBucketRateLimiterFilter.Config()))
                .dedupeResponseHeader(
                        "Access-Control-Allow-Origin Access-Control-Allow-Credentials Access-Control-Expose-Headers Vary",
                        "RETAIN_FIRST");
    }
}