//package com.academia.academia_api.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import springfox.documentation.builders.PathSelectors;
//import springfox.documentation.builders.RequestHandlerSelectors;
//import springfox.documentation.spi.DocumentationType;
//import springfox.documentation.spring.web.plugins.Docket;
//
//@Configuration
//public class SwaggerConfig {
//
//    @Bean
//    public Docket api() {
//        return new Docket(DocumentationType.OAS_30) // usa OpenAPI 3.0
//                .select()
//                .apis(RequestHandlerSelectors.basePackage("com.seupacote")) // <-- Altere para o seu pacote base
//                .paths(PathSelectors.any())
//                .build();
//    }
//}
