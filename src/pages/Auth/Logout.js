import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../services/userSlice";
import "../styling/Logout.css";

const Logout = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const handleLogout = (e) => {
        e.preventDefault();

        // Clear the token from localStorage
        localStorage.removeItem("jwtToken");

        // Dispatch logout action
        dispatch(logout());
    };

    return (
        <div className="logout">
            <h1>
                Welcome <span className="user_name">{user.name}</span>
            </h1>
            <button className="logout_button" onClick={(e) => handleLogout(e)}>
                Logout
            </button>
        </div>
    );
};

export default Logout;
