import React, {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';
import Navi from "./layout/Navi";
import {Container} from "semantic-ui-react";
import Dashboard from "./layout/Dashboard";
import 'semantic-ui-css/semantic.min.css';
import {useSelector, useDispatch} from "react-redux";
import {selectUser, login} from "./services/userSlice";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT", e);
        return null;
    }
}

function App() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        console.log("Token found in localStorage:", token);
        if (token) {
            const decodedToken = decodeJWT(token);
            console.log("Decoded token:", decodedToken);
            if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                dispatch(login({token}));
                console.log("Login action dispatched");
            } else {
                localStorage.removeItem('jwtToken');
                console.log("Token expired, removed from localStorage");
            }
        }
    }, [dispatch]);

    useEffect(() => {
        console.log("User state after dispatch:", user);
    }, [user]);

    return (
        <div className="App">
            {user?.loggedIn && (
                <>
                    <Navi/><Container className="main" textAlign="center">
                    <Dashboard/>
                    </Container>
                </>
            )}
            {!user?.loggedIn && (
                <Container>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Routes>
                </Container>
            )}
        </div>
    );
}

export default App;
