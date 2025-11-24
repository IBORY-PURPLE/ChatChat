package com.example.chat.auth;

import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    // username -> password 저장 (실서비스에서는 비밀번호 해시 필수)
    private final Map<String, String> userStore = new ConcurrentHashMap<>();

    // username -> token 저장
    @Getter
    private final Map<String, String> tokenStore = new ConcurrentHashMap<>();

    // 회원가입
    public void signup(String username, String password) {
        if (userStore.containsKey(username)) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        userStore.put(username, password);
    }

    // 로그인
    public LoginResponse login(String username, String password) {
        String storedPw = userStore.get(username);
        if (storedPw == null || !storedPw.equals(password)) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 토큰 생성 (간단히 UUID 사용)
        String token = UUID.randomUUID().toString();
        tokenStore.put(username, token);

        return new LoginResponse(username, token);
    }

    // 토큰 검증 (나중에 채팅 인증용으로 쓸 수 있음)
    public boolean validateToken(String username, String token) {
        String storedToken = tokenStore.get(username);
        return storedToken != null && storedToken.equals(token);
    }
}
