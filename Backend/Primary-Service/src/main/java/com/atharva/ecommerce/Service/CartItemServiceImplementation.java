package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Exception.CartItemException;
import com.atharva.ecommerce.Exception.UserException;
import com.atharva.ecommerce.Model.Cart;
import com.atharva.ecommerce.Model.CartItem;
import com.atharva.ecommerce.Model.Product;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Repository.CartItemRepository;
import com.atharva.ecommerce.Repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartItemServiceImplementation implements CartItemService {
    @Autowired
    private CartItemRepository cartItemRepository;
   @Autowired
    private UserService userService;
   @Autowired
   private CartRepository cartRepository;

    @Override
    public CartItem createCartItem(CartItem cartItem) {
        cartItem.setQuantity(1);
        cartItem.setPrice((int) (cartItem.getProduct().getPrice()*cartItem.getQuantity()));
        cartItem.setDiscountedPrice(cartItem.getDiscountedPrice()*cartItem.getQuantity());

        CartItem createdCartItem =cartItemRepository.save(cartItem);
        return createdCartItem;
    }

    @Override
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws CartItemException, UserException {
      CartItem item= findCartItemById(id);
      User user =userService.findUserById(item.getUserId());
      if(user.getId().equals(userId)){
          item.setQuantity(cartItem.getQuantity());
          item.setPrice((int) (item.getProduct().getPrice()*item.getQuantity()));
          item.setDiscountedPrice(item.getProduct().getDiscountPrice()*item.getQuantity());
      }


      return cartItemRepository.save(item);
    }

    @Override
    public CartItem isCartItemExist(Cart cart, Product product, String size, Long userId) {
      CartItem cartItem= cartItemRepository.isCartItemExist(cart, product, size, userId);
      return cartItem;
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) throws CartItemException, UserException {
             CartItem cartItem = findCartItemById(cartItemId);
             User user =userService.findUserById(cartItem.getUserId());

             User reqUser=userService.findUserById(userId);// LogIn user

             if(user.getId().equals(reqUser.getId())){
              cartItemRepository.deleteById(cartItemId);
             }
             else {
                 throw new UserException("you can't remove another user item");    
             }

    }

    @Override
    public CartItem findCartItemById(Long cartItemId) throws CartItemException {
        Optional<CartItem> opt=cartItemRepository.findById(cartItemId);
        if(opt.isPresent()){
            return opt.get();
        }
         throw new CartItemException("cartItem not found with id: "+cartItemId);
    }
}
