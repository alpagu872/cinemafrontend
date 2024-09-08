import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../services/apiClient';
import '../styling/BookingDetails.css'; // Bu CSS dosyasını oluşturmanız gerekecek

// Booking için doğrulama şeması
const BookingDetailsSchema = Yup.object().shape({
    noOfTickets: Yup.number().min(1, 'Must have at least one ticket').required('Number of tickets is required'),
    cardNumber: Yup.string().required('Card number is required'),
    nameOnCard: Yup.string().required('Name on card is required'),
});

const BookingDetails = () => {
    const { bookingId } = useParams(); // URL'den bookingId al
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [shows, setShows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await apiClient.get(`/bookings/${bookingId}`);
                setBooking(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch booking details:", error);
                setError("Failed to fetch booking details. Please try again later.");
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await apiClient.get('/users/getAll');
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setError("Failed to fetch users.");
            }
        };

        const fetchShows = async () => {
            try {
                const response = await apiClient.get('/shows/getAll');
                setShows(response.data);
            } catch (error) {
                console.error("Failed to fetch shows:", error);
                setError("Failed to fetch shows.");
            }
        };

        fetchBookingDetails();
        fetchUsers();
        fetchShows();
    }, [bookingId]);

    const handleSubmit = async (values) => {
        try {
            const selectedUser = users.find(user => user.webUserId === values.userId);
            const selectedShow = shows.find(show => show.showId === values.showId);

            const updatedBooking = {
                ...values,
                user: selectedUser,
                show: selectedShow,
            };

            await apiClient.put(`/bookings/${bookingId}`, updatedBooking);
            alert("Booking details updated successfully!");
            navigate('/bookingList');
        } catch (error) {
            console.error("Failed to update booking:", error);
            alert("Failed to update booking. Please try again later.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        if (confirmDelete) {
            try {
                await apiClient.delete(`/bookings/${bookingId}`);
                alert("Booking deleted successfully!");
                navigate('/bookingList');
            } catch (error) {
                console.error("Failed to delete booking:", error);
                alert("Failed to delete booking. Please try again later.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="booking-details-container">
            {booking && (
                <Formik
                    initialValues={{
                        userId: booking.user?.webUserId || '',
                        showId: booking.show?.showId || '',
                        noOfTickets: booking.noOfTickets,
                        cardNumber: booking.cardNumber,
                        nameOnCard: booking.nameOnCard,
                    }}
                    validationSchema={BookingDetailsSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="booking-details-form">
                            <div className="form-group">
                                <label htmlFor="userId">User</label>
                                <Field as="select" name="userId" className="form-input">
                                    <option value="" label="Select user" />
                                    {users.map(user => (
                                        <option key={user.webUserId} value={user.webUserId}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </Field>
                                {errors.userId && touched.userId ? (
                                    <div className="error">{errors.userId}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="showId">Show</label>
                                <Field as="select" name="showId" className="form-input">
                                    <option value="" label="Select show" />
                                    {shows.map(show => (
                                        <option key={show.showId} value={show.showId}>
                                            {show.movie.name} - {show.showDate} {show.showTime}
                                        </option>
                                    ))}
                                </Field>
                                {errors.showId && touched.showId ? (
                                    <div className="error">{errors.showId}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="noOfTickets">Number of Tickets</label>
                                <Field name="noOfTickets" type="number" className="form-input" />
                                {errors.noOfTickets && touched.noOfTickets ? (
                                    <div className="error">{errors.noOfTickets}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number</label>
                                <Field name="cardNumber" type="text" className="form-input" />
                                {errors.cardNumber && touched.cardNumber ? (
                                    <div className="error">{errors.cardNumber}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="nameOnCard">Name on Card</label>
                                <Field name="nameOnCard" type="text" className="form-input" />
                                {errors.nameOnCard && touched.nameOnCard ? (
                                    <div className="error">{errors.nameOnCard}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                            <button type="button" className="delete-button" onClick={handleDelete}>
                                Delete Booking
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default BookingDetails;
