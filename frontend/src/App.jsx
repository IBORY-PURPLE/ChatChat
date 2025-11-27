// src/App.js
import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Login, {action as loginAction } from "./pages/Login";
import {action as logoutAction} from "./pages/Logout"
import RootLayout from "./pages/RootLayout";
import Home from "./pages/Home";

function tokenLoader() {
    return localStorage.getItem("token")
}
// 라우터 정의: "/" 로 들어오면 ChatPage 렌더링
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        id: "root",
        loader: tokenLoader,
        children: [
            {index: true, element: <Home/>},
            {path: "auth", element: <Login/>, action: loginAction},
            {path: "logout", action: logoutAction},
            {path: "chat", element: <ChatPage/>}
        ]
    },
    // 필요하면 다른 페이지들 여기 추가:
    // { path: "/login", element: <LoginPage /> },
    // { path: "/signup", element: <SignupPage /> },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
