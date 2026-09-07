package com.atharva.ecommerce.Controller;

import com.atharva.ecommerce.Config.JwtProvider;
import com.atharva.ecommerce.Exception.UserException;
import com.atharva.ecommerce.Model.Cart;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Repository.UserRepository;
import com.atharva.ecommerce.Request.LoginRequest;
import com.atharva.ecommerce.Response.ApiResponse;
import com.atharva.ecommerce.Response.AuthResponse;
import com.atharva.ecommerce.Service.CartService;
import com.atharva.ecommerce.Service.CustomUserServiceImplementation;
import com.atharva.ecommerce.Service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private UserRepository userRepository;
    private JwtProvider jwtProvider;
    private PasswordEncoder passwordEncoder;
    private CustomUserServiceImplementation customUserServiceImplementation;
    private CartService cartService;
    private RefreshTokenService refreshTokenService;

    public AuthController(UserRepository userRepository,
                          JwtProvider jwtProvider,
                          PasswordEncoder passwordEncoder,
                          CustomUserServiceImplementation customUserServiceImplementation , CartService cartService,
                          RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.customUserServiceImplementation = customUserServiceImplementation;
        this.cartService = cartService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws UserException{
        String email = user.getEmail();
        String password = user.getPassword();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();

       User isEmailExist= userRepository.findByEmail(email);
       if(isEmailExist != null){

         throw new UserException("Email Already Exists");

       }

       User createdUser = new User();
       createdUser.setEmail(email);
       createdUser.setPassword(passwordEncoder.encode(password));
       createdUser.setFirstName(firstName);
       createdUser.setLastName(lastName);



      User savedUser= userRepository.save(createdUser);

       cartService.createCart(savedUser);

      Authentication authentication=new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());
      SecurityContextHolder.getContext().setAuthentication(authentication);

      String token=jwtProvider.generateToken(authentication);
      AuthResponse authResponse=new AuthResponse();
      authResponse.setJwt(token);
      authResponse.setRefreshToken(refreshTokenService.createRefreshToken(savedUser.getEmail()));
      authResponse.setMessage("SignUp Success");
      return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.CREATED);

    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginUserHandler(@RequestBody LoginRequest loginRequest) throws UserException, BadCredentialsException {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication=authentication(email,password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
      String token=  jwtProvider.generateToken(authentication);
        AuthResponse authResponse=new AuthResponse(token,"SignIn Success");
        authResponse.setRefreshToken(refreshTokenService.createRefreshToken(email));
      return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.CREATED) ;
    }

    // Frontend calls this when the 15-min access token expires. It trades a
    // valid refresh token for a brand-new access token - no re-login needed.
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody java.util.Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        String email = refreshTokenService.getEmailIfValid(refreshToken);
        if (email == null) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }
        Authentication auth = new UsernamePasswordAuthenticationToken(email, null, new java.util.ArrayList<>());
        String newAccessToken = jwtProvider.generateToken(auth);

        AuthResponse res = new AuthResponse();
        res.setJwt(newAccessToken);
        res.setRefreshToken(refreshToken); // non-rotating: same refresh token stays valid
        res.setMessage("Token refreshed");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Logout = destroy the refresh token so it can never mint new access tokens.
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestBody java.util.Map<String, String> body) {
        refreshTokenService.revoke(body.get("refreshToken"));
        return new ResponseEntity<>(new ApiResponse("Logged out successfully", true), HttpStatus.OK);
    }

    private Authentication authentication(String email, String password) {
     UserDetails userDetails = customUserServiceImplementation.loadUserByUsername(email);
     if(userDetails == null){
         throw new BadCredentialsException("Invalid Email or Password");
     }

   if(!passwordEncoder.matches(password, userDetails.getPassword())){
       throw new BadCredentialsException("Invalid Password");
   }

    return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());
    }

}
