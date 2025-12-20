package com.atharva.apigateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.bind.annotation.GetMapping;
import reactor.core.publisher.Mono;

@SpringBootTest
class ApiGatewayApplicationTests {

    @Test
    void contextLoads() {
    }


    @GetMapping("/gateway-test")
    public Mono<String> test() {
        return Mono.just("Gateway is working!");
    }
}
