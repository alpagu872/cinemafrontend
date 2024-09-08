import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../services/apiClient';
import '../styling/ScreenDetails.css'; // Bu CSS dosyasını oluşturacağız

// Screen için doğrulama şeması
const ScreenDetailsSchema = Yup.object().shape({
    screenId: Yup.string().required('Screen ID is required'),
    noOfSeatsGold: Yup.number().min(1, 'Must have at least one gold seat').required('Number of Gold Seats is required'),
    noOfSeatsSilver: Yup.number().min(1, 'Must have at least one silver seat').required('Number of Silver Seats is required'),
    theatreId: Yup.string().required('Theatre ID is required'),
});

const ScreenDetails = () => {
    const { screenId } = useParams(); // URL'den screenId al
    const [screen, setScreen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theatres, setTheatres] = useState([]); // Tüm tiyatro verilerini tutmak için state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScreenDetails = async () => {
            try {
                const response = await apiClient.get(`/screens/${screenId}`);
                setScreen(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch screen details:", error);
                setError("Failed to fetch screen details. Please try again later.");
                setLoading(false);
            }
        };

        const fetchTheatres = async () => {
            try {
                const response = await apiClient.get('/theatres/getAll');
                setTheatres(response.data);
            } catch (error) {
                console.error("Failed to fetch theatres:", error);
                setError("Failed to fetch theatres.");
            }
        };

        fetchScreenDetails();
        fetchTheatres();
    }, [screenId]);

    const handleSubmit = async (values) => {
        try {
            const selectedTheatre = theatres.find(theatre => theatre.theatreId === values.theatreId);
            const updatedScreen = {
                ...values,
                theatre: selectedTheatre, // Theatre bilgilerini ekle
            };

            await apiClient.put(`/screens/${screenId}`, updatedScreen); // Screen detaylarını güncelle
            alert("Screen details updated successfully!");
            navigate('/screenList');
        } catch (error) {
            console.error("Failed to update screen:", error);
            alert("Failed to update screen. Please try again later.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this screen?");
        if (confirmDelete) {
            try {
                await apiClient.delete(`/screens/${screenId}`);
                alert("Screen deleted successfully!");
                navigate('/screenList'); // Silme işleminden sonra screen listesine dön
            } catch (error) {
                console.error("Failed to delete screen:", error);
                alert("Failed to delete screen. Please try again later.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="screen-details-container">
            {screen && (
                <Formik
                    initialValues={{
                        screenId: screen.screenId,
                        noOfSeatsGold: screen.noOfSeatsGold,
                        noOfSeatsSilver: screen.noOfSeatsSilver,
                        theatreId: screen.theatre?.theatreId || '', // Eğer theatre yoksa boş bırak
                    }}
                    validationSchema={ScreenDetailsSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="screen-details-form">
                            <div className="form-group">
                                <label htmlFor="screenId">Screen ID</label>
                                <Field name="screenId" type="text" className="form-input" disabled />
                                {errors.screenId && touched.screenId ? (
                                    <div className="error">{errors.screenId}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="noOfSeatsGold">Number of Seats (Gold)</label>
                                <Field name="noOfSeatsGold" type="number" className="form-input" />
                                {errors.noOfSeatsGold && touched.noOfSeatsGold ? (
                                    <div className="error">{errors.noOfSeatsGold}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="noOfSeatsSilver">Number of Seats (Silver)</label>
                                <Field name="noOfSeatsSilver" type="number" className="form-input" />
                                {errors.noOfSeatsSilver && touched.noOfSeatsSilver ? (
                                    <div className="error">{errors.noOfSeatsSilver}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="theatreId">Theatre</label>
                                <Field as="select" name="theatreId" className="form-input">
                                    <option value="" label="Select theatre" />
                                    {theatres.map(theatre => (
                                        <option key={theatre.theatreId} value={theatre.theatreId}>
                                            {theatre.nameOfTheatre} - {theatre.area}
                                        </option>
                                    ))}
                                </Field>
                                {errors.theatreId && touched.theatreId ? (
                                    <div className="error">{errors.theatreId}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                            <button type="button" className="delete-button" onClick={handleDelete}>
                                Delete Screen
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default ScreenDetails;
