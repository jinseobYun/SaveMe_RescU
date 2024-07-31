package com.ssafy.smru.config;

import com.ssafy.smru.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Order(1)
public class AppSecurityConfig {
    private final AppJwtProvider appJwtProvider;
    private static final String APP_BASE_URL = "/api/v1/app";

    @Bean
    public SecurityFilterChain appFilterChain(HttpSecurity http) throws Exception {
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
//                                    .requestMatchers(HttpMethod.GET, "/files/**").permitAll()
//                                    .requestMatchers(HttpMethod.POST, "/login", "/signup").permitAll()
                            // 관리자 로그인한 사용자만 가능
//                                    .requestMatchers(HttpMethod.GET).hasAnyRole("ADMIN")
//                                    .requestMatchers(HttpMethod.DELETE).hasAnyRole("ADMIN")
//                                    .requestMatchers(HttpMethod.POST).hasAnyRole("ADMIN")
//                                    .requestMatchers(HttpMethod.PUT).hasAnyRole("ADMIN")
                            .anyRequest().authenticated();
                })
                .addFilterBefore(new AppJwtAuthenticationFilter(appJwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}