package com.atharva.ecommerce.DTO;

import java.io.Serializable;
import java.time.LocalDateTime;

public class OrderStatusUpdateEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long orderId;
    private String oldStatus;
    private String newStatus;
    private String userEmail;
    private LocalDateTime updatedAt;

    public OrderStatusUpdateEvent() {}

    public OrderStatusUpdateEvent(Long orderId, String oldStatus, String newStatus, String userEmail) {
        this.orderId = orderId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.userEmail = userEmail;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }
    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "OrderStatusUpdateEvent{" +
                "orderId=" + orderId +
                ", oldStatus='" + oldStatus + '\'' +
                ", newStatus='" + newStatus + '\'' +
                '}';
    }
}