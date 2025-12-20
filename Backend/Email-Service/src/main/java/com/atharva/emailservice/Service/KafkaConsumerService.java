package com.atharva.emailservice.Service;


import com.atharva.emailservice.DTO.EmailNotificationEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;
@Service
public class KafkaConsumerService {


    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${kafka.topic.email-notification}")
    private String emailNotificationTopic;

    @KafkaListener(topics = "${kafka.topic.email-notification}" ,groupId = "${spring.kafka.consumer.group-id}" )
    public void consumerEmailNotificationEvent(EmailNotificationEvent event){
        logger.info("📥 Received Email Notification Event: {}", event);

        try{
            sendEmail(event);
            logger.info("✅ Email sent successfully to: {}", event.getTo());
        }
        catch (Exception e) {
            logger.error("❌ Error sending email: {}", e.getMessage());
            // Could implement retry logic here
        }

    }

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
public void sendEmail(EmailNotificationEvent event) throws MessagingException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

    // 1. Prepare the dynamic data for the template
    Context context = new Context();
    context.setVariable("name", "Customer"); // You could add a 'name' field to your DTO
    context.setVariable("body", event.getBody());
    String subject = event.getSubject();
    String orderId = "0000"; // fallback default

    if (subject != null && subject.contains("#")) {
        orderId = subject.substring(subject.indexOf('#') + 1).trim();
    }

    context.setVariable("orderId", orderId);
    // 2. Process the template (Choose template based on emailType)
    String templateName = event.getEmailType().equalsIgnoreCase("ORDER_CONFIRMATION")
            ? "order-confirmation" : "generic-email";
    String htmlContent = templateEngine.process(templateName, context);

    // 3. Set Email Metadata
    helper.setFrom("atharvacjagtap2005@gmail.com");
    helper.setTo(event.getTo());
    helper.setSubject(event.getSubject());
    helper.setText(htmlContent, true); // 'true' tells Spring this is HTML

    mailSender.send(message);
    logger.info("📧 Professional HTML Email sent to {}", event.getTo());
}

}
