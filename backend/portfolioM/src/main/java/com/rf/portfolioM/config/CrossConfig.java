package com.rf.portfolioM.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CrossConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("https://portfoliom.xyz","http://localhost:5173","https://portfolio-m-steel.vercel.app")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // PATCH eklendi
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600); // 1 saat boyunca cache’lenebilir
            }
        };
    }
}
