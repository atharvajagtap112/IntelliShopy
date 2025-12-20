package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Config.JwtProvider;
import com.atharva.ecommerce.Exception.UserException;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImplementation implements  UserService{

      @Autowired
      private UserRepository userRepository;

      @Autowired
      private JwtProvider jwtProvider;

    @Override
    public User findUserById(Long userId) throws UserException {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UserException("User not found");
    }

    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
      String email=  jwtProvider.getEmailFromToken(jwt);

     User user= userRepository.findByEmail(email);
     if (user == null) {
         throw new UserException("User not found with email: " + email);
     }
     return user;

    }
}
