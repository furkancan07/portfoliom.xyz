package com.rf.portfolioM.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
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
@RequiredArgsConstructor
public class WebSecurity {
    private final JwtFilter filter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler successHandler;


    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/v1/user/list").hasRole("ADMIN")
                        .requestMatchers("/api/v1/user/{id}", "/api/v1/user/username/*",
                                "/api/v1/user/create", "/api/v1/user/me",
                                "/api/v1/comment/project/**", "/api/v1/project/{id}","api/v1/user/search/**",
                                "/api/v1/project/list/**", "/api/v1/auth/**", "/api/v1/experience/{userId}").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/h2-console/**")
                        .permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(a -> a.userInfoEndpoint(y -> y.userService(customOAuth2UserService))
                        .successHandler(successHandler)

                ).exceptionHandling(ex -> ex.authenticationEntryPoint(((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Unauthorized\"}");
                })))
                .csrf(AbstractHttpConfigurer::disable)

                .headers(AbstractHttpConfigurer::disable)
                .sessionManagement(x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
