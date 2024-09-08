import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../services/apiClient';
import '../styling/ShowDetails.css'; // Create and use this CSS file for styling

const ShowDetailsSchema = Yup.object().shape({
    showTime: Yup.string().required('Show Time is required'),
    showDate: Yup.string().required('Show Date is required'),
    seatsRemainingGold: Yup.number().required('Seats Remaining (Gold) is required'),
    seatsRemainingSilver: Yup.number().required('Seats Remaining (Silver) is required'),
    classCostGold: Yup.number().required('Class Cost (Gold) is required'),
    classCostSilver: Yup.number().required('Class Cost (Silver) is required'),
});

const ShowDetails = () => {
    const { showId } = useParams(); // Get showId from the URL
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShowDetails = async () => {
            try {
                const response = await apiClient.get(`/shows/${showId}`);
                setShow(response.data);
            } catch (error) {
                console.error("Failed to fetch show details:", error);
                setError("Failed to fetch show details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchShowDetails();
    }, [showId]);

    const handleSubmit = async (values) => {
        console.log("Submitting values:", values);  // Log the values being sent
        try {
            const response = await apiClient.put(`/shows/${showId}`, values);
            console.log("Show updated successfully:", response.data);
            alert("Show details updated successfully!");
            navigate('/showList');
        } catch (error) {
            console.error("Failed to update show:", error);
            alert("Failed to update show. Please try again later.");
        }
    };


    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this show?");
        if (confirmDelete) {
            try {
                await apiClient.delete(`/shows/${showId}`);
                alert("Show deleted successfully!");
                navigate('/showList'); // Redirect to the show list page after deletion
            } catch (error) {
                console.error("Failed to delete show:", error);
                alert("Failed to delete show. Please try again later.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="show-details-container">
            {show && (
                <Formik
                    initialValues={{
                        showTime: show.showTime,
                        showDate: show.showDate,
                        seatsRemainingGold: show.seatsRemainingGold,
                        seatsRemainingSilver: show.seatsRemainingSilver,
                        classCostGold: show.classCostGold,
                        classCostSilver: show.classCostSilver,
                    }}
                    validationSchema={ShowDetailsSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="show-details-form">
                            <div className="form-group">
                                <label htmlFor="showTime">Show Time</label>
                                <Field name="showTime" type="text" className="form-input" />
                                {errors.showTime && touched.showTime ? (
                                    <div className="error">{errors.showTime}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="showDate">Show Date</label>
                                <Field name="showDate" type="text" className="form-input" />
                                {errors.showDate && touched.showDate ? (
                                    <div className="error">{errors.showDate}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="seatsRemainingGold">Seats Remaining (Gold)</label>
                                <Field name="seatsRemainingGold" type="number" className="form-input" />
                                {errors.seatsRemainingGold && touched.seatsRemainingGold ? (
                                    <div className="error">{errors.seatsRemainingGold}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="seatsRemainingSilver">Seats Remaining (Silver)</label>
                                <Field name="seatsRemainingSilver" type="number" className="form-input" />
                                {errors.seatsRemainingSilver && touched.seatsRemainingSilver ? (
                                    <div className="error">{errors.seatsRemainingSilver}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="classCostGold">Class Cost (Gold)</label>
                                <Field name="classCostGold" type="number" className="form-input" />
                                {errors.classCostGold && touched.classCostGold ? (
                                    <div className="error">{errors.classCostGold}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="classCostSilver">Class Cost (Silver)</label>
                                <Field name="classCostSilver" type="number" className="form-input" />
                                {errors.classCostSilver && touched.classCostSilver ? (
                                    <div className="error">{errors.classCostSilver}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                            <button type="button" className="delete-button" onClick={handleDelete}>
                                Delete Show
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default ShowDetails;
