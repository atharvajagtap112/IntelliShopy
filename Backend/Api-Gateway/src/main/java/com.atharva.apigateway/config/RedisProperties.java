package com.atharva.apigateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@Component
@Data
@ConfigurationProperties(prefix = "rate-limiter.redis")
public class RedisProperties {

    // Full connection URL (redis:// or rediss:// for TLS, e.g. Upstash) -
    // Jedis parses host/port/user/password/ssl from this directly.
    private String url = "redis://localhost:6379";

    @Bean
    public JedisPool getJedisPool() {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(50);
        poolConfig.setMaxIdle(10);
        poolConfig.setMinIdle(5);
        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);
        return new JedisPool(poolConfig, url);
    }
}
