package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Exception.UserException;
import com.atharva.ecommerce.Model.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {



     public User findUserById(Long userId) throws UserException;

     public User findUserProfileByJwt(String jwt) throws UserException;



}
