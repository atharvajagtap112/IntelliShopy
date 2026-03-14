package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.DTO.EmailNotificationEvent;
import com.atharva.ecommerce.DTO.OrderCreatedEvent;
import com.atharva.ecommerce.DTO.OrderStatusUpdateEvent;
import com.atharva.ecommerce.DTO.PaymentSuccessEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.concurrent.CompletableFuture;

@Service
public class KafkaProducerService {

    @Autowired
   private KafkaTemplate <String,Object> kafkaTemplate;


    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);



    @Value("${kafka.topic.email-notification}")
    private String emailNotificationTopic;



    public void sendEmailNotificationEvent(EmailNotificationEvent event) {
        kafkaTemplate.send(emailNotificationTopic,event.getTo(),event);
    }


}
