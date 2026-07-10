package com.devmind.template.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

/**
 * Central list of routes the JWT filter and security chain treat as public.
 * Add new public routes here rather than scattering permitAll() calls.
 */
@Configuration
public class PublicEndpointConfig {

    @Bean
    public RequestMatcher publicEndpoints() {
        return new OrRequestMatcher(
            new AntPathRequestMatcher("/**", HttpMethod.OPTIONS.name()),
            new AntPathRequestMatcher("/health"),
            new AntPathRequestMatcher("/auth/login")
        );
    }
}
