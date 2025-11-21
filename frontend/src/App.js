import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './App.css'; // ★ CSS 파일 임포트 필수!

let stompClient = null;

function App() {
    const [userData, setUserData] = useState({
        username: '',
        connected: false,
        message: ''
    });
    const [publicChats, setPublicChats] = useState([]);

    const connect = () => {
        // 이름이 비어있으면 접속 막기
        if (!userData.username.trim()) {
            alert("이름을 입력해주세요!");
            return;
        }
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe('/topic/public', onMessageReceived);
        stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: userData.username, type: 'JOIN' }));
    }

    const onError = (err) => { console.log(err); }

    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        setPublicChats(prev => [...prev, payloadData]);
    }

    const sendValue = () => {
        if (stompClient && userData.message.trim()) { // 빈 메시지 방지
            const chatMessage = {
                sender: userData.username,
                content: userData.message,
                type: 'CHAT'
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: "" });
        }
    }

    // 엔터키 쳤을 때 전송되도록 추가
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendValue();
        }
    }

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => {
                                if (chat.type === 'JOIN' || chat.type === 'LEAVE') {
                                    return (
                                        <li key={index} className="message-item join">
                                            <div className="message-data">
                                                {chat.sender}님이 {chat.type === 'JOIN' ? '입장' : '퇴장'}하셨습니다.
                                            </div>
                                        </li>
                                    );
                                }
                                return (
                                    <li
                                        key={index}
                                        className={`message-item ${chat.sender === userData.username ? "self" : "other"}`}
                                    >
                                        {/* 상대방일 때만 이름 표시 */}
                                        {chat.sender !== userData.username &&
                                            <div className="sender-name">{chat.sender}</div>}
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
                            onChange={(e) => setUserData({...userData, message: e.target.value})}
                            onKeyPress={handleKeyPress} // 엔터키 기능 추가
                        />
                        <button type="button" onClick={sendValue}>전송</button>
                    </div>
                </div>
            ) : (
                <div className="register">
                    <h2>채팅 입장</h2>
                    <input
                        id="user-name"
                        placeholder="이름을 입력하세요"
                        value={userData.username}
                        onChange={(e) => setUserData({...userData, username: e.target.value})}
                    />
                    <button type="button" onClick={connect}>입장하기</button>
                </div>
            )}
        </div>
    );
}
export default App;