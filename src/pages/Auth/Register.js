import React from 'react';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import UserService from '../../services/UserService';  // Import the UserService
import '../styling/Register.css';
import {useNavigate} from "react-router-dom";

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    emailId: Yup.string().email('Invalid email').required('Email is required'),
    age: Yup.number().min(0, 'Age must be positive').required('Age is required'),
    phoneNumber: Yup.string().required('Phone Number is required').matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
    username: Yup.string().required('Username is required'),
    role: Yup.string().oneOf(['USER', 'ADMIN'], 'Invalid role').required('Role is required')
});

const userService = new UserService();  // Instantiate the UserService


const Register = () => {

    const navigate = new useNavigate();  // Initialize useNavigate for navigation

    const handleSubmit = async (values, {resetForm}) => {
        console.log("Submitting values:", values); // Log the data being sent
        try {
            await userService.createUser(values);  // Call the UserService to create a new user
            alert("User registered successfully!");
            resetForm();
            navigate('/login');  // Redirect to the login page after successful registration
        } catch (error) {
            console.error("Failed to register user:", error);
            alert("Failed to register user. Please try again later.");
        }
    };


    return (
        <div className="register-container">
            <h2>Register</h2>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    emailId: '',
                    age: '',
                    phoneNumber: '',
                    password: '',
                    username: '',
                    role: 'USER'  // Default role set to 'User'
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
            >
                {({errors, touched}) => (
                    <Form className="register-form">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <Field name="firstName" type="text" className="form-input"/>
                            {errors.firstName && touched.firstName ? (
                                <div className="error">{errors.firstName}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <Field name="lastName" type="text" className="form-input"/>
                            {errors.lastName && touched.lastName ? (
                                <div className="error">{errors.lastName}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailId">Email</label>
                            <Field name="emailId" type="email" className="form-input"/>
                            {errors.emailId && touched.emailId ? (
                                <div className="error">{errors.emailId}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <Field name="age" type="number" className="form-input"/>
                            {errors.age && touched.age ? (
                                <div className="error">{errors.age}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <Field name="phoneNumber" type="text" className="form-input"/>
                            {errors.phoneNumber && touched.phoneNumber ? (
                                <div className="error">{errors.phoneNumber}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" className="form-input"/>
                            {errors.password && touched.password ? (
                                <div className="error">{errors.password}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Field name="username" type="text" className="form-input"/>
                            {errors.username && touched.username ? (
                                <div className="error">{errors.username}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <Field name="role" as="select" className="form-input" disabled>
                                <option value="User">USER</option>
                                <option value="Admin">ADMIN</option>
                            </Field>
                            {errors.role && touched.role ? (
                                <div className="error">{errors.role}</div>
                            ) : null}
                        </div>
                        <button type="submit" className="submit-button">
                            Register
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;
