//package com.atharva.ecommerce.Service;
//
//import com.atharva.ecommerce.DTO.EmailNotificationEvent;
//import com.atharva.ecommerce.DTO.OrderCreatedEvent;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class KafkaConsumerService {
//
//
//    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);
//    @Autowired
//    private JavaMailSender mailSender;
//
//
//    @Value("${kafka.topic.email-notification}")
//    private String emailNotificationTopic;
//
//    @KafkaListener(topics = "${kafka.topic.email-notification}" ,groupId = "${spring.kafka.consumer.group-id}" )
//    public void consumerEmailNotificationEvent(EmailNotificationEvent event){
//        logger.info("📥 Received Email Notification Event: {}", event);
//
//        try{
//            sendEmail(event);
//            logger.info("✅ Email sent successfully to: {}", event.getTo());
//        }
//        catch (Exception e) {
//            logger.error("❌ Error sending email: {}", e.getMessage());
//            // Could implement retry logic here
//        }
//
//    }
//
//    public void sendEmail(EmailNotificationEvent event){
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom("atharvacjagtap2005@gmail.com");
//        message.setTo(event.getTo());
//        message.setSubject(event.getSubject());
//        message.setText(event.getBody());
//
//        mailSender.send(message);
//
//        logger.info("📧 Email sent: {} to {}", event.getEmailType(), event.getTo());
//    }
//}
