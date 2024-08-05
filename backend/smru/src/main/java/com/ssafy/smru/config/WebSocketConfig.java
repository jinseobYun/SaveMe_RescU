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

    //
    // 1. 프론트엔드 에서 신고 시 join_room 을 소켓을 통해 백엔드로 보냄
    // 2. 백엔드에서는 소켓을 수신하여 stomp 프로토콜 registerStompEndpoints로 신고자가 접속 할 수 있는 엔드포인트(/signaling) 설정
    // 3. 메시지 브로커로 인해 클라이언트는 /app경로로 메시지를 보내고 /topic 경로로 메시지 받을 수 있음
    // 4. 프론트에서 offer를 생성하고 시그널링 서버로 전달
    // 5. 백엔드에서 이 메시지를 컨트롤러에서 PeerHandleOffer,PeerHandleAnswer가  처리하고 상황실에 전달

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/signaling")// 클라이언트 접속시 엔드포인트
                .setAllowedOriginPatterns("*") // CORS
                .withSockJS(); // 브라우저에서 WebSocket 을 지원하지 않는 경우 sockjs 사용함
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        // stomp 최대 버퍼 사이즈를 늘리기 위한 설정 필요없으면 주석 처리해도됨
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

}
