import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";


function RootLayout() {
    return (
        <>
                <MainNavigation></MainNavigation>
                <Outlet />
        </>
    );
}

export default RootLayout;
