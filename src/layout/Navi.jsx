import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Container } from "semantic-ui-react";
import { useNavigate, NavLink } from "react-router-dom";
import SignedOut from "./SignedOut";
import SignedIn from "./SignedIn";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../services/userSlice";

export default function Navi() {
    const userState = useSelector(selectUser); // Select user state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Update local state based on global authentication state
        setIsAuthenticated(userState?.loggedIn || false);
    }, [userState]);

    const handleSignOut = () => {
        console.log("Logout button clicked");

        // Clear the token from localStorage
        localStorage.removeItem('jwtToken');
        console.log("JWT token removed from localStorage");

        // Dispatch logout action
        dispatch(logout());
        console.log("Logout action dispatched");

        // Redirect to login page after sign out
        navigate("/login");
        console.log("Navigating to login page");
    };

    return (
        <Menu inverted fixed="top">
            <Container>
                <MenuItem as={NavLink} to="/movieSelection" name="Bilet Satın Al" />
                {isAuthenticated && userState?.user?.role === "ADMIN" && (
                    <>
                        <MenuItem as={NavLink} to="/movieList" name="Film Listesi" />
                        <MenuItem as={NavLink} to="/userList" name="Kullanıcı Listesi" />
                    </>
                )}
                {isAuthenticated && userState?.user?.role === "USER" && (
                    <>
                        <MenuItem as={NavLink} to="/userInfo" name="Profilim" />
                    </>
                )}
                <Menu.Menu position="right">
                    {isAuthenticated ? (
                        <SignedIn onSignOut={handleSignOut} />
                    ) : (
                        <SignedOut onSignIn={() => setIsAuthenticated(true)} />
                    )}
                </Menu.Menu>
            </Container>
        </Menu>
    );
}
