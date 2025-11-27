package com.example.chat.auth;

import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    // username -> password 저장 (실서비스에서는 비밀번호 해시 필수)
    private final Map<String, User> userStore = new ConcurrentHashMap<>();

    // username -> token 저장
    @Getter
    private final Map<String, String> tokenStore = new ConcurrentHashMap<>();


    @Getter
    public static class User {
        private final String userID;
        private final String password;
        private final String name;

        public User(String userID, String password, String name) {
            this.userID = userID;
            this.password = password;
            this.name = name;
        }
    }

    // 회원가입
    public void signup(String userID, String password, String name) {
        if (userID == null || userID.isBlank()) {
            throw new IllegalArgumentException("userID는 필수값임");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("password는 필수값임");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name은 필수값임");
        }

        if (userStore.containsKey(userID)) {
            throw new IllegalArgumentException("이미 존재하는 userID임");
        }

        User user = new User(userID, password, name);
        userStore.put(userID, user);
    }

    // 로그인
    public LoginResponse login(String userID, String password) {
        if (userID == null || userID.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("userID와 password는 필수임");
        }

        User user = userStore.get(userID);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 userID임");
        }

        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않음");
        }

        // 토큰 생성 (간단히 UUID 사용)
        String token = UUID.randomUUID().toString();
        tokenStore.put(userID, token);

        return new LoginResponse(userID, token);
    }

    // 토큰 검증 (나중에 채팅 인증용으로 쓸 수 있음)
    public boolean validateToken(String userID, String token) {
        String storedToken = tokenStore.get(userID);
        return storedToken != null && storedToken.equals(token);
    }
}
