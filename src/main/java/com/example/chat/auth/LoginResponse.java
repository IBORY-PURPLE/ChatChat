package com.example.chat.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 로그인 요청 응답값으로 토큰과 userID를 저장
@Getter
@AllArgsConstructor
public class LoginResponse {
    private String userID;
    private String token;   // 지금은 간단히 UUID 같은 문자열 토큰
}
