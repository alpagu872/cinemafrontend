import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../services/apiClient';
import '../styling/UserDetails.css'; // Create this CSS file for styling

// User validation schema
const UserDetailsSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    emailId: Yup.string().email('Invalid email').required('Email is required'),
    age: Yup.number().min(1, 'Age must be a positive number').required('Age is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    username: Yup.string().required('Username is required'),  // Added validation for username
    role: Yup.string().required('Role is required'),
});

const UserDetails = () => {
    const { webUserId } = useParams(); // Get webUserId from URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await apiClient.get(`/users/getById/${webUserId}`);
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
                setError("Failed to fetch user details. Please try again later.");
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [webUserId]);

    const handleSubmit = async (values) => {
        try {
            await apiClient.put(`/users/update/${webUserId}`, values); // Update user details
            console.log(values)
            alert("User details updated successfully!");
            navigate('/userList');
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Failed to update user. Please try again later.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                await apiClient.delete(`/users/delete/${webUserId}`);
                alert("User deleted successfully!");
                navigate('/userList'); // Navigate back to the user list
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("Failed to delete user. Please try again later.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="user-details-container">
            {user && (
                <Formik
                    initialValues={{
                        firstName: user.firstName || '', // null değerini '' ile değiştir
                        lastName: user.lastName || '',
                        emailId: user.emailId || '',
                        age: user.age || '',
                        phoneNumber: user.phoneNumber || '',
                        username: user.username || '', // null değerini '' ile değiştir
                        role: user.role || 'USER', // Varsayılan olarak 'USER' rolü
                    }}
                    validationSchema={UserDetailsSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="user-details-form">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <Field name="firstName" type="text" className="form-input" />
                                {errors.firstName && touched.firstName ? (
                                    <div className="error">{errors.firstName}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <Field name="lastName" type="text" className="form-input" />
                                {errors.lastName && touched.lastName ? (
                                    <div className="error">{errors.lastName}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="emailId">Email</label>
                                <Field name="emailId" type="email" className="form-input" />
                                {errors.emailId && touched.emailId ? (
                                    <div className="error">{errors.emailId}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <Field name="age" type="number" className="form-input" />
                                {errors.age && touched.age ? (
                                    <div className="error">{errors.age}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <Field name="phoneNumber" type="text" className="form-input" />
                                {errors.phoneNumber && touched.phoneNumber ? (
                                    <div className="error">{errors.phoneNumber}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" className="form-input" />
                                {errors.username && touched.username ? (
                                    <div className="error">{errors.username}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <Field as="select" name="role" className="form-input">
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </Field>
                                {errors.role && touched.role ? (
                                    <div className="error">{errors.role}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                            <button type="button" className="delete-button" onClick={handleDelete}>
                                Delete User
                            </button>
                        </Form>
                    )}
                </Formik>

            )}
        </div>
    );
};

export default UserDetails;
