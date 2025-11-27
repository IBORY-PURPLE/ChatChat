import { redirect } from "react-router-dom";

export function action() {
    localStorage.removeItem("userID");
    localStorage.removeItem("name");
    localStorage.removeItem("token");

    return redirect("/auth?mode=login");
}
