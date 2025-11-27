// src/pages/ChatPage.jsx
import React, { useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import "../App.css";
import {loadServerConfig} from "../serverConfig";

// STOMP 클라이언트는 ref에 저장 (렌더링과 분리)
function ChatPage() {
    const stompClientRef = useRef(null);

    const [userData, setUserData] = useState({
        username: "",
        connected: false,
        message: "",
    });

    const [publicChats, setPublicChats] = useState([]);

    // 서버에 연결
    const connect = async () => {
        const username = userData.username.trim();
        if (!userData.username.trim()) {
            alert("이름을 입력해주세요!");
            return;
        }

        // ★ SockJS 대신 브라우저 WebSocket 사용
        const config = await loadServerConfig();
        const wsServer = config.wsServer;
        const client = Stomp.over(() => new WebSocket(wsServer));
        // 필요 없으면 콘솔 로그 끄기
        client.debug = () => {};

        client.connect({}, () => onConnected(client, username), onError);
        stompClientRef.current = client;
    };

    const onConnected = (client, username) => {
        setUserData((prev) => ({ ...prev, connected: true }));

        // 1.전체방
        client.subscribe("/topic/public", onMessageReceived);
        // 2. 내 개인 채널
        client.subscribe(`/topic/${username}`, onMessageReceived);

        // 입장 알림
        client.send(
            "/app/chat.addUser",
            {},
            JSON.stringify({ sender: userData.username, type: "JOIN" })
        );
    };

    const onError = (err) => {
        console.error("STOMP error:", err);
        alert("서버와 연결 중 오류가 발생했습니다.");
    };

    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        setPublicChats((prev) => [...prev, payloadData]);
    };

    const sendValue = () => {
        const client = stompClientRef.current;
        if (!client || !userData.message.trim()) return;

        const chatMessage = {
            sender: userData.username,
            content: userData.message,
            type: "CHAT",
        };

        client.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        setUserData((prev) => ({ ...prev, message: "" }));
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendValue();
        }
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => {
                                if (chat.type === "JOIN" || chat.type === "LEAVE") {
                                    return (
                                        <li key={index} className="message-item join">
                                            <div className="message-data">
                                                {chat.sender}님이{" "}
                                                {chat.type === "JOIN" ? "입장" : "퇴장"}하셨습니다.
                                            </div>
                                        </li>
                                    );
                                }

                                const isSelf = chat.sender === userData.username;

                                // WHISPER 메시지 표시 (귓속말)
                                if (chat.type === "WHISPER") {
                                    const isSender = chat.sender === userData.username;
                                    const label = isSender
                                        ? `(귓속말 → ${chat.recipient})`
                                        : `(귓속말 ← ${chat.sender})`;
                                    return (
                                        <li
                                            key={index}
                                            className={`message-item whisper ${
                                                isSelf ? "self" : "other"
                                            }`}
                                        >
                                            {!isSelf && (
                                                <div className="sender-name">
                                                    {chat.sender} <span className="whisper-label">{label}</span>
                                                </div>
                                            )}
                                            {isSelf && (
                                                <div className="sender-name">
                                                    나 <span className="whisper-label">{label}</span>
                                                </div>
                                            )}
                                            <div className="message-data">{chat.content}</div>
                                        </li>
                                    );
                                }

                                // 일반 채팅
                                return (
                                    <li
                                        key={index}
                                        className={`message-item ${isSelf ? "self" : "other"}`}
                                    >
                                        {!isSelf && (
                                            <div className="sender-name">{chat.sender}</div>
                                        )}
                                        <div className="message-data">{chat.content}</div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="send-message">
                        <input
                            type="text"
                            placeholder="메시지를 입력하세요..."
                            value={userData.message}
                            onChange={(e) =>
                                setUserData((prev) => ({ ...prev, message: e.target.value }))
                            }
                            onKeyPress={handleKeyPress}
                        />
                        <button type="button" onClick={sendValue}>
                            전송
                        </button>
                    </div>
                </div>
            ) : (
                <div className="register">
                    <h2>채팅 입장</h2>
                    <input
                        id="user-name"
                        placeholder="이름을 입력하세요"
                        value={userData.username}
                        onChange={(e) =>
                            setUserData((prev) => ({ ...prev, username: e.target.value }))
                        }
                    />
                    <button type="button" onClick={connect}>
                        입장하기
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChatPage;
