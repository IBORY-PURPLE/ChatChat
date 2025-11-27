package com.example.chat.auth;

import lombok.Getter;
import lombok.Setter;

// 회원가입 요청 필요 필드값
@Getter
@Setter
public class SignupRequest {
    private String userID;
    private String password;
    private String name;
}
