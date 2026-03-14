package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Model.Order;
import com.atharva.ecommerce.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService{

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmationEmail(Order order) {
        User user = order.getUser();
        String toEmail = user.getEmail();
        String name = user.getFirstName();

        StringBuilder sb = new StringBuilder();
        sb.append("Hi ").append(name).append(",\n\n");
        sb.append("Thank you for your order ").append(order.getId()).append(".\n");
        sb.append("Total Amount: Rs.").append(order.getTotalDiscountedPrice()).append("\n");
        sb.append("Order Status: ").append(order.getOrderStatus()).append("\n\n");
        sb.append("Your order items:\n");

        order.getOrderItems().forEach(item -> {
            sb.append("- ").append(item.getProduct().getTitle())
                    .append(" x ").append(item.getQuantity())
                    .append(" (Rs.").append(item.getDiscountedPrice()).append(")\n");
        });

        sb.append("\nWe will notify you once your order is shipped.");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Order Confirmation - " + order.getId());
        message.setText(sb.toString());

        mailSender.send(message);
    }
}
