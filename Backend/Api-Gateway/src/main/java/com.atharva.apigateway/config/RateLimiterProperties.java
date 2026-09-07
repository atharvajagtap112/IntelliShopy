package com.atharva.apigateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "rate-limiter")
public class RateLimiterProperties {

    private long capacity = 20;

    private long refillRate = 10;
}
