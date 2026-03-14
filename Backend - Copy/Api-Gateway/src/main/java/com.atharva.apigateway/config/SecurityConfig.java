package com.atharva.apigateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;


import javax.crypto.SecretKey;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/api/**").authenticated()
                        .anyExchange().permitAll()
                )
                .addFilterAt(jwtWebFilter(), SecurityWebFiltersOrder.AUTHENTICATION);

        return http.build();
    }

    @Bean
    public WebFilter jwtWebFilter() {
        return (exchange, chain) -> {
            String authHeader =
                    exchange.getRequest().getHeaders().getFirst("Authorization");

            // Only validate JWT for /api/**
            if (exchange.getRequest().getPath().value().startsWith("/api/")
                    && authHeader != null
                    && authHeader.startsWith("Bearer ")) {

                try {
                    String token = authHeader.substring(7);

                    SecretKey key =
                            Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

                    Claims claims = Jwts.parserBuilder()
                            .setSigningKey(key)
                            .build()
                            .parseClaimsJws(token)
                            .getBody();

                    String email = claims.get("email", String.class);
                    String authorities = claims.get("authorities", String.class);

                    Authentication authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    AuthorityUtils.commaSeparatedStringToAuthorityList(authorities)
                            );

                    return chain.filter(exchange)
                            .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));

                } catch (Exception e) {
                    return Mono.error(new RuntimeException("Invalid JWT"));
                }
            }

            // No JWT required for /products/** or /chat/**
            return chain.filter(exchange);
        };
    }
}
