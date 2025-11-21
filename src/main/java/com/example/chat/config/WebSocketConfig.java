package com.example.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// 환경 설정 및 연결 통로 개설
@Configuration // ChatApplication이 이 문구를 보고 load해온다.
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // React에서 접속할 엔드포인트: ws://localhost:8080/ws
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /topic으로 시작하는 메시지는 구독자에게 바로 전달 (Pub/Sub)
        registry.enableSimpleBroker("/topic");
        // /app으로 시작하는 메시지는 @MessageMapping 메서드로 라우팅
        registry.setApplicationDestinationPrefixes("/app");
    }
}
