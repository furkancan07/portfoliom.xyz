package com.rf.portfolioM.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/*
 Herkese Açık
 api/v1/user/{id}
 api/v1/user/username/*
 api/v1/user/list

 api/v1/comment/project/*
 api/v1/project/{id}
 api/v1/user/5

 api/v1/project/list/*
 api/v1/auth/*
 */
@EnableWebSecurity
@Configuration
public class WebSecurity {
    private final JwtFilter filter;

    public WebSecurity(JwtFilter filter) {
        this.filter = filter;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/v1/user/{id}", "/api/v1/user/username/*", "/api/v1/user/list",
                                "api/v1/user/create",
                                "/api/v1/comment/project/**", "/api/v1/project/{id}", "/api/v1/user/5",
                                "/api/v1/project/list/**", "/api/v1/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**","/h2-console/**")
                        .permitAll()
                        .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable)
                .headers(AbstractHttpConfigurer::disable)
                .sessionManagement(x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)

        ;


        return http.build();
    }

}
