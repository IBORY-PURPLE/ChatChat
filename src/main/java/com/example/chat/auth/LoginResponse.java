package com.example.chat.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String username;
    private String token;   // 지금은 간단히 UUID 같은 문자열 토큰
}
