import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../src/services/apiClient';
import '../pages/styling/UserInfo.css';

const UserInfo = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);
    const loggedIn = useSelector(state => state.user.loggedIn);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await apiClient.get(`/users/getById/${user.webUserId}`);
                setUserDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                setError("Failed to fetch user info. Please try again later.");
                setLoading(false);
            }
        };

        if (loggedIn && user && user.webUserId) {
            fetchUserInfo();
        } else {
            setError("User is not logged in.");
            setLoading(false);
        }
    }, [user, loggedIn]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="user-info-container">
            {userDetails && (
                <div className="user-info-details">
                    <h2>User Information</h2>
                    <p><strong>First Name:</strong> {userDetails.firstName}</p>
                    <p><strong>Last Name:</strong> {userDetails.lastName}</p>
                    <p><strong>Email:</strong> {userDetails.emailId}</p>
                    <p><strong>Age:</strong> {userDetails.age}</p>
                    <p><strong>Phone Number:</strong> {userDetails.phoneNumber}</p>
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>Role:</strong> {userDetails.role}</p>
                    <button onClick={() => navigate(`/userInfo/${userDetails.webUserId}`)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default UserInfo;
