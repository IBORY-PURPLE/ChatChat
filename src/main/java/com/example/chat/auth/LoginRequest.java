package com.example.chat.auth;

import lombok.Getter;
import lombok.Setter;

// 로그인요청 시 필요 필드값
@Getter
@Setter
public class LoginRequest {
    private String userID;
    private String password;
}
