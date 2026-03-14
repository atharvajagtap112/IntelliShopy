package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Exception.CartItemException;
import com.atharva.ecommerce.Exception.ProductException;
import com.atharva.ecommerce.Exception.UserException;
import com.atharva.ecommerce.Request.AddItemRequest;
import com.atharva.ecommerce.Model.Cart;
import com.atharva.ecommerce.Model.User;

public interface CartService {
    public Cart createCart(User user);
    public String addCartItem(Long userId, AddItemRequest req) throws ProductException, CartItemException, UserException;
    public Cart findUserCart(Long userId);
}
