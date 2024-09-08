import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../services/apiClient';
import '../styling/TheatreDetails.css'; // Bu CSS dosyasını oluşturacağız

// Theatre için doğrulama şeması
const TheatreDetailsSchema = Yup.object().shape({
    theatreId: Yup.string().required('Theatre ID is required'),
    nameOfTheatre: Yup.string().required('Name of Theatre is required'),
    noOfScreens: Yup.number().min(1, 'Must have at least one screen').required('Number of Screens is required'),
    area: Yup.string().required('Area is required'),
});

const TheatreDetails = () => {
    const { theatreId } = useParams(); // URL'den theatreId al
    const [theatre, setTheatre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTheatreDetails = async () => {
            try {
                const response = await apiClient.get(`/theatres/${theatreId}`);
                setTheatre(response.data);
            } catch (error) {
                console.error("Failed to fetch theatre details:", error);
                setError("Failed to fetch theatre details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTheatreDetails();
    }, [theatreId]);

    const handleSubmit = async (values) => {
        try {
            await apiClient.put(`/theatres/${theatreId}`, values);  // Theatre detaylarını güncelle
            alert("Theatre details updated successfully!");
            navigate('/theatreList');
        } catch (error) {
            console.error("Failed to update theatre:", error);
            alert("Failed to update theatre. Please try again later.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this theatre?");
        if (confirmDelete) {
            try {
                await apiClient.delete(`/theatres/${theatreId}`);
                alert("Theatre deleted successfully!");
                navigate('/theatreList'); // Silme işleminden sonra theatre listesine dön
            } catch (error) {
                console.error("Failed to delete theatre:", error);
                alert("Failed to delete theatre. Please try again later.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="theatre-details-container">
            {theatre && (
                <Formik
                    initialValues={{
                        theatreId: theatre.theatreId,
                        nameOfTheatre: theatre.nameOfTheatre,
                        noOfScreens: theatre.noOfScreens,
                        area: theatre.area,
                    }}
                    validationSchema={TheatreDetailsSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="theatre-details-form">
                            <div className="form-group">
                                <label htmlFor="theatreId">Theatre ID</label>
                                <Field name="theatreId" type="text" className="form-input" disabled />
                                {errors.theatreId && touched.theatreId ? (
                                    <div className="error">{errors.theatreId}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="nameOfTheatre">Name of Theatre</label>
                                <Field name="nameOfTheatre" type="text" className="form-input" />
                                {errors.nameOfTheatre && touched.nameOfTheatre ? (
                                    <div className="error">{errors.nameOfTheatre}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="noOfScreens">Number of Screens</label>
                                <Field name="noOfScreens" type="number" className="form-input" />
                                {errors.noOfScreens && touched.noOfScreens ? (
                                    <div className="error">{errors.noOfScreens}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="area">Area</label>
                                <Field name="area" type="text" className="form-input" />
                                {errors.area && touched.area ? (
                                    <div className="error">{errors.area}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                            <button type="button" className="delete-button" onClick={handleDelete}>
                                Delete Theatre
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default TheatreDetails;
