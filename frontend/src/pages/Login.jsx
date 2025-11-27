import AuthForm from "../components/AuthForm";
import { redirect } from "react-router-dom";
import {loadServerConfig} from "../serverConfig";

export default function Login() {
    return <AuthForm />;
}

export async function action({ request }) {
    console.log(request.url);
    const searchParams = new URL(request.url).searchParams;
    const mode = searchParams.get("mode") || "login";

    if (mode !== "login" && mode !== "signup") {
        throw new Response(JSON.stringify({ message: "Unsupported mode" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const data = await request.formData();
    const authData = {
        userID: data.get("userID"),
        password: data.get("password"),
        name: data.get("name"),
    };


    const config = await loadServerConfig();
    const server = config.server;
    const response = await fetch(`${server}/auth/` + mode, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
    });

    // authform에서 useActionData 훅으로 오류를 폼 안에서 생성.
    if (response.status === 422 || response.status === 401) {
        return response;
    }

    if (response.status === 404) {
        throw json(
            { message: "OOOOOOOOOOOOOOOOOOOO" },
            {
                status: 400,
                statusText: "Could not register",
            }
        );
    }

    if (!response.ok) {
        throw new Response(null, {
            status: 500,
            statusText: "Could not authenticate user.",
        });
    }

    if (mode === "signup") {
        return redirect("/auth?mode=login&message=sigup-success");
    }

    if (mode === "login") {
        const resData = await response.json();
        console.log(resData);
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userID", resData.userID);
        localStorage.setItem("name", resData.name);

        return redirect("/");
    }
}
