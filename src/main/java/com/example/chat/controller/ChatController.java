package com.example.chat.controller;

import com.example.chat.model.ChatMessage;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Controller // 실제 요청 처리 및 방송 진행
public class ChatController {

    private final SimpMessageSendingOperations messagingTemplate;

    // 생성자 주입
    public ChatController(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // 귓속말 패턴: <사용자명/> {메세지내용}
    private static final Pattern WHISPER_PATTERN =
            Pattern.compile("^<([^/>]+)\\s*/>\\s*(.*)$");

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        String originalContent = chatMessage.getContent();
        Matcher matcher = WHISPER_PATTERN.matcher(originalContent);

        if (matcher.matches()) {
            String targetUser = matcher.group(1).trim();
            String pureContent = matcher.group(2).trim();

            chatMessage.setType(ChatMessage.MessageType.WHISPER);
            chatMessage.setContent(pureContent);
            chatMessage.setRecipient(targetUser);

            // 상대방 개인 채널로 전송
            messagingTemplate.convertAndSend("/topic/" + targetUser, chatMessage);
            // 보낸 사람도 자기 채널에서 보이게 하기.
            messagingTemplate.convertAndSend("/topic/" + chatMessage.getSender(), chatMessage);
        } else {
            chatMessage.setType(ChatMessage.MessageType.CHAT);
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
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
