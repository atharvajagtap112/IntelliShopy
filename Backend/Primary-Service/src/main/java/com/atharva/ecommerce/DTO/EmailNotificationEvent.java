package com.atharva.ecommerce.DTO;

import java.io.Serializable;

public class EmailNotificationEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String to;
    private String subject;
    private String body;
    private String emailType; // ORDER_CONFIRMATION, ORDER_SHIPPED, etc.

    public EmailNotificationEvent() {}

    public EmailNotificationEvent(String to, String subject, String body, String emailType) {
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.emailType = emailType;
    }

    // Getters and setters
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getEmailType() { return emailType; }
    public void setEmailType(String emailType) { this.emailType = emailType; }

    @Override
    public String toString() {
        return "EmailNotificationEvent{" +
                "to='" + to + '\'' +
                ", emailType='" + emailType + '\'' +
                '}';
    }
}