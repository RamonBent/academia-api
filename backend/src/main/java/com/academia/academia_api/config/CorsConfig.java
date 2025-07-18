package com.academia.academia_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Foco nas rotas da API
                .allowedOrigins(
                        "http://localhost:8081",
                        "http://localhost:19000",
                        "http://localhost:19006",
                        "http://192.168.1.108:19000",
                        "http://192.168.1.108:8081",
                        "exp://192.168.1.108:19000"  // Adicione o schema do Expo
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")  // Headers que o frontend pode acessar
                .allowCredentials(true)
                .maxAge(3600);
    }
}