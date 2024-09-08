import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../services/apiClient';
import '../styling/TicketDetails.css'; // Bu CSS dosyasını oluşturacağız

// Ticket için doğrulama şeması
const TicketDetailSchema = Yup.object().shape({
    ticketClass: Yup.string().required('Ticket Class is required'),
    price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
});

const TicketDetail = () => {
    const { ticketId } = useParams(); // URL'den ticketId al
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await apiClient.get(`/tickets/${ticketId}`);
                setTicket(response.data);
            } catch (error) {
                console.error("Failed to fetch ticket details:", error);
                setError("Failed to fetch ticket details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [ticketId]);

    const handleSubmit = async (values) => {
        try {
            await apiClient.put(`/tickets/${ticketId}`, values);  // Ticket detaylarını güncelle
            alert("Ticket details updated successfully!");
            navigate('/ticketList');
        } catch (error) {
            console.error("Failed to update ticket:", error);
            alert("Failed to update ticket. Please try again later.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
        if (confirmDelete) {
            try {
                await apiClient.delete(`/tickets/${ticketId}`);
                alert("Ticket deleted successfully!");
                navigate('/ticketList'); // Silme işleminden sonra ticket listesine dön
            } catch (error) {
                console.error("Failed to delete ticket:", error);
                alert("Failed to delete ticket. Please try again later.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="ticket-detail-container">
            {ticket && (
                <Formik
                    initialValues={{
                        ticketClass: ticket.ticketClass,
                        price: ticket.price,
                    }}
                    validationSchema={TicketDetailSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="ticket-detail-form">
                            <div className="form-group">
                                <label htmlFor="ticketClass">Ticket Class</label>
                                <Field name="ticketClass" type="text" className="form-input" />
                                {errors.ticketClass && touched.ticketClass ? (
                                    <div className="error">{errors.ticketClass}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <Field name="price" type="number" className="form-input" />
                                {errors.price && touched.price ? (
                                    <div className="error">{errors.price}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                            <button type="button" className="delete-button" onClick={handleDelete}>
                                Delete Ticket
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default TicketDetail;
