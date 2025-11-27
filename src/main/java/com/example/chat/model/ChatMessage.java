package com.example.chat.model;


// 서버와 클라이언트가 주고받을 데이터의 형태를 정의한다.
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;

    // 귓속말 대상자 이름
    private String recipient;

    public enum MessageType {
        CHAT, JOIN, LEAVE,
        WHISPER
    }
    public ChatMessage() {}

    public MessageType getType() {return type;}
    public void setType(MessageType type) {this.type = type;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public String getSender() {return sender;}
    public void setSender(String sender) {this.sender = sender;}

    public String getRecipient() {return recipient;}
    public void setRecipient(String recipient) {this.recipient = recipient;}

}
