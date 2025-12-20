package com.atharva.ecommerce.DTO;

import java.io.Serializable;
import java.time.LocalDateTime;

public class OrderCreatedEvent implements Serializable {


    private Long orderId;
    private String orderPublicId;
    private Long userId;
    private String userEmail;
    private String userName;
    private Integer totalAmount;
    private Integer discountedAmount;
    private Integer totalItems;
    private String orderStatus;
    private LocalDateTime createdAt;

    public OrderCreatedEvent() {}

    public OrderCreatedEvent(Long orderId, String orderPublicId, Long userId, String userEmail,
                             String userName, Integer totalAmount, Integer discountedAmount,
                             Integer totalItems, String orderStatus) {
        this.orderId = orderId;
        this.orderPublicId = orderPublicId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.totalAmount = totalAmount;
        this.discountedAmount = discountedAmount;
        this.totalItems = totalItems;
        this.orderStatus = orderStatus;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderPublicId() { return orderPublicId; }
    public void setOrderPublicId(String orderPublicId) { this.orderPublicId = orderPublicId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Integer getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Integer totalAmount) { this.totalAmount = totalAmount; }
    public Integer getDiscountedAmount() { return discountedAmount; }
    public void setDiscountedAmount(Integer discountedAmount) { this.discountedAmount = discountedAmount; }
    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "OrderCreatedEvent{" +
                "orderId=" + orderId +
                ", orderPublicId='" + orderPublicId + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", discountedAmount=" + discountedAmount +
                ", orderStatus='" + orderStatus + '\'' +
                '}';
    }
}