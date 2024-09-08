import React from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiClient from '../services/apiClient'; // Use apiClient instead of axios
import './styling/AddFilm.css';

const AddFilmSchema = Yup.object().shape({

    name: Yup.string()
        .required('Name is required'),
    language: Yup.string()
        .required('Language is required'),
    genre: Yup.string()
        .required('Genre is required'),
    targetAudience: Yup.string()
        .required('Target Audience is required')
});

const AddFilm = () => {
    return (
        <div className="add-film-container">
            <h2>Add New Film</h2>
            <Formik
                initialValues={{
                    movieId: '',
                    name: '',
                    language: '',
                    genre: '',
                    targetAudience: ''
                }}
                validationSchema={AddFilmSchema}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        console.log("Submitting film data:", values);
                        const response = await apiClient.post('/movies', values); // Use apiClient for the POST request
                        console.log("Film added successfully:", response.data);
                        alert("Film added successfully!");
                        resetForm();
                    } catch (error) {
                        console.error("Error adding film:", error);
                        alert("Failed to add film. Please try again.");
                    }
                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form className="add-film-form">
                        <div className="form-group">
                            <label htmlFor="movieId">Movie ID</label>
                            <Field name="movieId" type="text" className="form-input" disabled/>
                            {errors.movieId && touched.movieId ? (
                                <div className="error">{errors.movieId}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Field name="name" type="text" className="form-input" />
                            {errors.name && touched.name ? (
                                <div className="error">{errors.name}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="language">Language</label>
                            <Field name="language" type="text" className="form-input" />
                            {errors.language && touched.language ? (
                                <div className="error">{errors.language}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="genre">Genre</label>
                            <Field name="genre" type="text" className="form-input" />
                            {errors.genre && touched.genre ? (
                                <div className="error">{errors.genre}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="targetAudience">Target Audience</label>
                            <Field name="targetAudience" type="text" className="form-input" />
                            {errors.targetAudience && touched.targetAudience ? (
                                <div className="error">{errors.targetAudience}</div>
                            ) : null}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="submit-button">
                            {isSubmitting ? "Adding..." : "Add Film"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddFilm;
