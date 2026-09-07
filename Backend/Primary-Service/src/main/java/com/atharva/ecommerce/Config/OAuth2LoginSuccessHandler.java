package com.atharva.ecommerce.Config;

import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Repository.UserRepository;
import com.atharva.ecommerce.Service.CartService;
import com.atharva.ecommerce.Service.RefreshTokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final CartService cartService;
    private final RefreshTokenService refreshTokenService;

    // Where the backend redirects the browser after a successful Google login.
    // Configurable via app.frontend.url (env FRONTEND_URL); defaults to local dev.
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(UserRepository userRepository,
                                     JwtProvider jwtProvider,
                                     CartService cartService,
                                     RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
        this.cartService = cartService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        User user = userRepository.findByEmail(email);

        if (user == null) {

            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName != null ? firstName : "");
            user.setLastName(lastName != null ? lastName : "");
            // No password for OAuth users — set a random unusable password
            user.setPassword("OAUTH2_USER_NO_PASSWORD");
            user.setRole("CUSTOMER");

            User savedUser = userRepository.save(user);

            cartService.createCart(savedUser);

            user = savedUser;
        }

        Authentication jwtAuth = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, new java.util.ArrayList<>()
        );
        String token = jwtProvider.generateToken(jwtAuth);
        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        // Backend tells the browser (via HTTP 302) to go to the frontend callback
        // with both the short access token and the refresh token.
        response.sendRedirect(frontendUrl + "/oauth/callback?token=" + token
                + "&refreshToken=" + refreshToken);
    }
}
