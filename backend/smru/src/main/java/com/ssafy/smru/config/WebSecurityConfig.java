package com.ssafy.smru.config;

import com.ssafy.smru.security.WebJwtAuthenticationFilter;
import com.ssafy.smru.security.WebJwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Order(2)
public class WebSecurityConfig {
    private final WebJwtProvider webJwtProvider;
    private static final String WEB_BASE_URL = "/api/v1/web";


    @Bean
    @Order(1)
    public SecurityFilterChain webFilterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic(httpSecurityHttpBasicConfigurer -> {
                    httpSecurityHttpBasicConfigurer.disable();
                })
                .csrf(httpSecurityCsrfConfigurer -> {
                    httpSecurityCsrfConfigurer.disable();
                })
                .sessionManagement(httpSecuritySessionManagementConfigurer -> {
                    httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .authorizeHttpRequests(authorizationManagerRequestMatcherRegistry -> {
                    authorizationManagerRequestMatcherRegistry
                            // 모든 사용자 가능
                            .requestMatchers( "/**").permitAll()
                            .anyRequest().authenticated();
                })
                .addFilterBefore(new WebJwtAuthenticationFilter(webJwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}