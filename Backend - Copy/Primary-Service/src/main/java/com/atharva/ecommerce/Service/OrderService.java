package com.atharva.ecommerce.Service;


import com.atharva.ecommerce.Exception.OrderException;
import com.atharva.ecommerce.Model.Address;
import com.atharva.ecommerce.Model.Order;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Request.ProductCategoryRequest;
import com.atharva.ecommerce.Response.ProductsByCategoryResponse;

import java.util.List;

public interface OrderService {

    public Order createOrder(User user, Address shippingAddress);

    public Order findOrderById(Long orderId) throws OrderException;

    public List<Order> usersOrderHistory(Long userId);

    public Order placedOrder(Long orderId) throws OrderException;

    public Order confirmedOrder(Long orderId) throws OrderException;

    public Order shippedOrder(Long orderId) throws OrderException;

    public List<Order> getAllOrders();

    public void deleteOrder(Long orderId) throws OrderException;
    public Order deliveredOrder(Long orderId) throws OrderException;

    public Order cancledOrder(Long orderId) throws OrderException;
}
