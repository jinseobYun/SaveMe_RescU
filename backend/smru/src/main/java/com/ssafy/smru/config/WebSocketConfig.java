/*
package com.ssafy.smru.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.AbstractWebSocketMessage;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker // STOMP 사용하여 클라이언트와 서버간의 메시지 전송 지원
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/signaling")// 클라이언트 접속시 엔드포인트
                .setAllowedOriginPatterns("*") // CORS
                .withSockJS(); // 브라우저에서 WebSocket 을 지원하지 않는 경우에 대안으로 어플리케이션의 코드를 변경할 필요 없이 런타임에 필요할 때 대체하기 위해 설정
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        // stomp 최대 버퍼 사이즈를 늘리기 위한 설정
        registry.setMessageSizeLimit(50000 * 1024); //STOMP 메시지 크기 50MB
        registry.setSendBufferSizeLimit(10240 * 1024); // 전송 버퍼 크기 10MB
        registry.setSendTimeLimit(20000); // 20초내에 메시지가 전송되지 않으면 실패
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 메시지 브로커 설정
        config.enableSimpleBroker("/topic"); // broker url 설정 해당 경로로 전송된 메시지 수신 가능
        config.setApplicationDestinationPrefixes("/app"); // 클라이언트가 서버로 메시지를 전송할 때 사용할 URL의 접두사를 /app
    }

}*/
