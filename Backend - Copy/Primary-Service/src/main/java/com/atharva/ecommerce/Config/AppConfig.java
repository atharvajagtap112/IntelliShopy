package com.atharva.ecommerce.Config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Configuration
public class AppConfig {




    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //so by default spring Security store the username and password in the cookies here
        //we are making it to stateless so we can use our own session management by using jwt
        http.sessionManagement(session-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize->authorize.requestMatchers("/api/**")
                .authenticated().anyRequest().permitAll())
                .addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)
                .csrf(csrf-> {
                            try {
                                csrf.disable();
//                                .cors(configurationSource->configurationSource.configurationSource(new CorsConfigurationSource() {
//                                            @Override
//                                            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//                                                CorsConfiguration cfg = new CorsConfiguration();
//                                                cfg.setAllowedOrigins(List.of(
//                                                        "http://localhost:3000",
//                                                        "https://intellishopy.vercel.app"
//                                                        ));
//                                                cfg.setAllowedMethods(Collections.singletonList("*"));
//                                                cfg.setAllowCredentials(true);
//                                                cfg.setAllowedHeaders(Collections.singletonList("*"));
//                                                cfg.setExposedHeaders(Collections.singletonList("Authorization"));
//                                                cfg.setMaxAge(3600L);
//                                                return cfg;
//                                            }
//                                        }));
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                        }
                ).httpBasic(Customizer.withDefaults())
                .formLogin(Customizer.withDefaults());

     return http.build();     
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
