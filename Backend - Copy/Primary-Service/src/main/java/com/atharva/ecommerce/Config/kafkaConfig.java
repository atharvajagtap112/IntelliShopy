package com.atharva.ecommerce.Config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;


@Configuration
public class kafkaConfig {


    @Value("${kafka.topic.email-notification}")
    private String emailNotificationTopic;





    @Bean
    public NewTopic emailNotificationTopic() {
        return TopicBuilder.name(emailNotificationTopic)
                .partitions(1)
                .replicas(1)
                .build();
    }

}
