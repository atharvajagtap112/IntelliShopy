package com.atharva.ecommerce.Repository;

import com.atharva.ecommerce.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Newest first. Without an explicit ORDER BY, MySQL returns rows in whatever
    // order it likes, so the orders page showed an old order above a new one.
    // Sorted on orderDate because that is the date the UI actually displays.
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND (o.orderStatus = 'PLACED' OR o.orderStatus = 'ORDER_CONFIRMED' OR o.orderStatus = 'SHIPPED' OR o.orderStatus = 'OUT_FOR_DELIVERY'  OR o.orderStatus = 'DELIVERED') ORDER BY o.orderDate DESC")
    public List<Order> getUserOrders(@Param("userId") Long userId);

}
