package com.atharva.intellishopyserviceregistory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class  IntellishopyServiceRegistoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(IntellishopyServiceRegistoryApplication.class, args);
    }

}
