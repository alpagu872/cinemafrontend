import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/userSlice";
import axios from "axios";
import "../styling/Login.css";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);  // Add loading state
    const [error, setError] = useState(null);  // Add error state
    const dispatch = useDispatch();
    const navigate = useNavigate();  // Initialize useNavigate for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // console.log("Starting login process...");

            // console.log("Phone Number:", phoneNumber);
            // console.log("Password:", password);

            // Call your backend API for login
            const response = await axios.post("http://localhost:8080/api/authenticate", {
                phoneNumber: phoneNumber,
                password: password,
            });

            console.log("Received response:", response.data);

            // Assuming the response contains the JWT token
            const token = response.data.token;

            if (token) {
                // Store token in localStorage or state
                localStorage.setItem("jwtToken", token);

                // Dispatch login action with token
                dispatch(
                    login({
                        phoneNumber: phoneNumber,
                        token: token,
                        loggedIn: true,
                    })
                );

                console.log("Login successful!");
            } else {
                throw new Error("Token not found in response.");
            }
        } catch (error) {
            console.error("Login failed", error);
            setError("Login failed. Please check your credentials and try again.");

            // More detailed error logging
            if (error.response) {
                console.error("Server responded with an error:", error.response.data);
            } else if (error.request) {
                console.error("No response received from server:", error.request);
            } else {
                console.error("Error setting up the request:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = () => {
        navigate("/register");  // Navigate to the register page when the register button is clicked
    };

    return (
        <div className="login">
            <form className="login_form" onSubmit={(e) => handleSubmit(e)}>
                <h1>Login Here 📝</h1>
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="submit_btn" disabled={loading}>
                    {loading ? "Logging in..." : "Submit"}
                </button>
                {error && <p className="error_message">{error}</p>} {/* Display error message */}
            </form>
            <button className="register_btn" onClick={handleRegisterClick}>
                Register
            </button>
        </div>
    );
};

export default Login;
