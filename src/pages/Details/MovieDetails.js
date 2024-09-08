import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../services/apiClient';
import '../styling/MovieDetails.css'; // Create and use this CSS file for styling

const MovieDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    language: Yup.string().required('Language is required'),
    genre: Yup.string().required('Genre is required'),
    targetAudience: Yup.string().required('Target Audience is required'),
});

const MovieDetails = () => {
    const { movieId } = useParams(); // Get movieId from the URL
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await apiClient.get(`/movies/${movieId}`);
                setMovie(response.data);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
                setError("Failed to fetch movie details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const handleSubmit = async (values) => {
        try {
            await apiClient.put(`/movies/${movieId}`, values);  // Update movie details
            alert("Movie details updated successfully!");
            navigate('/movieList');
        } catch (error) {
            console.error("Failed to update movie:", error);
            alert("Failed to update movie. Please try again later.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
        if (confirmDelete) {
            try {
                await apiClient.delete(`/movies/${movieId}`);
                alert("Movie deleted successfully!");
                navigate('/movieList'); // Redirect to the movie list page after deletion
            } catch (error) {
                console.error("Failed to delete movie:", error);
                alert("Failed to delete movie. Please try again later.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="movie-details-container">
            {movie && (
                <Formik
                    initialValues={{
                        name: movie.name,
                        language: movie.language,
                        genre: movie.genre,
                        targetAudience: movie.targetAudience,
                    }}
                    validationSchema={MovieDetailsSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="movie-details-form">
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
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                            <button type="button" className="delete-button" onClick={handleDelete}>
                                Delete Movie
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default MovieDetails;
