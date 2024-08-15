package com.ssafy.smru.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@RequiredArgsConstructor
public class AppJwtAuthenticationFilter extends GenericFilterBean {
    private final AppJwtProvider jwtProvider;
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        /**
         * Request Header 에서 JWT 추출
         * */
        String token = resolveToken((HttpServletRequest) request);

        /**
         * validateToken 으로 토큰 유효성 검사
         * */
        if (token != null && jwtProvider.validateToken(token)) {
            // 토큰이 유효할 경우
            // 토큰에서 Authentication 객체를 가져와 SecurityContext 에 저장
            Authentication authentication = jwtProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        chain.doFilter(request, response);
    }


    /**
     * Request Header 에서 토큰 정보를 추출하는 함수
     * */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
