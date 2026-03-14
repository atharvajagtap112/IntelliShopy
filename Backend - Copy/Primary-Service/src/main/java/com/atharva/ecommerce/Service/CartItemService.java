package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Exception.CartItemException;
import com.atharva.ecommerce.Exception.UserException;
import com.atharva.ecommerce.Model.Cart;
import com.atharva.ecommerce.Model.CartItem;
import com.atharva.ecommerce.Model.Product;

public interface CartItemService {
 public CartItem createCartItem(CartItem cartItem);
 public CartItem updateCartItem(Long userId,Long id,CartItem cartItem) throws CartItemException, UserException;
 public CartItem isCartItemExist(Cart cart, Product product,String size,Long userId);
 public void removeCartItem(Long userId,Long cartItemId) throws CartItemException, UserException;
 public CartItem findCartItemById(Long cartItemId) throws CartItemException;
}
