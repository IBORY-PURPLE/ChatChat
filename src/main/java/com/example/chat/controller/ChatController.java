package com.example.chat.controller;

import com.example.chat.model.ChatMessage;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller // 실제 요청 처리 및 방송 진행
public class ChatController {

    // 1. 채팅 메세지 전달
    // /chat.sendMessage로 온 요청을 낚아채서 필요한 로직 수행 후 sento로 송출 버튼 누름.
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        System.out.println("메시지 도착함! 내용: " + chatMessage.getContent());
        return chatMessage;
    }
    // 2. 사용자 입장 처리
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        // 웹소켓 세션에 사용자 이름 저장(나중에 퇴장할 때 사용)
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }
}
