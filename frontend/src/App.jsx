// src/App.js
import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ChatPage from "./pages/ChatPage";

// 라우터 정의: "/" 로 들어오면 ChatPage 렌더링
const router = createBrowserRouter([
    {
        path: "/",
        element: <ChatPage />,
    },
    // 필요하면 다른 페이지들 여기 추가:
    // { path: "/login", element: <LoginPage /> },
    // { path: "/signup", element: <SignupPage /> },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
