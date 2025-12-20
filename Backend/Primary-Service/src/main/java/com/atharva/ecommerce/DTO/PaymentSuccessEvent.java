package com.atharva.ecommerce.DTO;

import java.io.Serializable;
import java.time.LocalDateTime;

public class PaymentSuccessEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long orderId;
    private String paymentId;
    private Integer amount;
    private String userEmail;
    private String userName;
    private String paymentStatus;
    private LocalDateTime paymentTime;

    public PaymentSuccessEvent() {}

    public PaymentSuccessEvent(Long orderId, String paymentId, Integer amount,
                               String userEmail, String userName, String paymentStatus) {
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.amount = amount;
        this.userEmail = userEmail;
        this.userName = userName;
        this.paymentStatus = paymentStatus;
        this.paymentTime = LocalDateTime.now();
    }

    // Getters and setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }

    @Override
    public String toString() {
        return "PaymentSuccessEvent{" +
                "orderId=" + orderId +
                ", paymentId='" + paymentId + '\'' +
                ", amount=" + amount +
                ", paymentStatus='" + paymentStatus + '\'' +
                '}';
    }
}