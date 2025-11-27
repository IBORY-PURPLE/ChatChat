import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

export default function MainNavigation() {
    const token = useRouteLoaderData("root");

    return (
        <nav className="flex justify-center items-center gap-4 mt-6">
            {/* Home */}
            <NavLink
                to=""
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
            >
                Home
            </NavLink>

            {/* Login */}
            {!token && (
                <NavLink
                    to="/auth?mode=login"
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    Login
                </NavLink>
            )}

            {/* Logout */}
            {token && (
                <Form
                    action="/logout"
                    method="post"
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                >
                    <button type="submit">Logout</button>
                </Form>
            )}

            {/* My Page */}
            {token && (
                <NavLink
                    to="/chat"
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    ChatingPage
                </NavLink>
            )}
        </nav>
    );
}
