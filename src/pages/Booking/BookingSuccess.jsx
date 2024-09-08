import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import jsPDF from 'jspdf';
import apiClient from '../../services/apiClient';

const BookingSuccess = () => {
    const { bookingId } = useParams(); // URL'den bookingId'yi alıyoruz
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (bookingId) {
            console.log(bookingId);
            apiClient.get(`/bookings/${bookingId}`)
                .then(response => {
                    setBookingDetails(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to fetch booking details:', error);
                    setLoading(false);
                });
        } else {
            console.error('No bookingId provided');
            setLoading(false);
        }
    }, [bookingId]);

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Başlık ve temel bilgiler
        doc.setFontSize(18);
        doc.text('Booking Confirmation', 20, 20);
        doc.setFontSize(12);
        doc.text(`Booking ID: ${bookingDetails.bookingId}`, 20, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);

        // Kullanıcı Bilgileri
        doc.setFontSize(16);
        doc.text('User Information', 20, 45);
        doc.setFontSize(12);
        doc.text(`Name: ${bookingDetails.user.firstName} ${bookingDetails.user.lastName}`, 20, 55);
        doc.text(`Email: ${bookingDetails.user.emailId}`, 20, 60);
        doc.text(`Phone: ${bookingDetails.user.phoneNumber}`, 20, 65);

        // Film ve Gösterim Bilgileri
        doc.setFontSize(16);
        doc.text('Show Details', 20, 75);
        doc.setFontSize(12);
        doc.text(`Movie: ${bookingDetails.show.movie.name}`, 20, 85);
        doc.text(`Genre: ${bookingDetails.show.movie.genre}`, 20, 90);
        doc.text(`Language: ${bookingDetails.show.movie.language}`, 20, 95);
        doc.text(`Show Date: ${bookingDetails.show.showDate}`, 20, 100);
        doc.text(`Show Time: ${bookingDetails.show.showTime.hour}:${bookingDetails.show.showTime.minute}`, 20, 105);
        doc.text(`Theatre: ${bookingDetails.show.screen.theatre.nameOfTheatre}`, 20, 110);
        doc.text(`Screen: ${bookingDetails.show.screen.screenId}`, 20, 115);
        doc.text(`Seats Remaining (Gold): ${bookingDetails.show.seatsRemainingGold}`, 20, 120);
        doc.text(`Seats Remaining (Silver): ${bookingDetails.show.seatsRemainingSilver}`, 20, 125);

        // Rezervasyon ve Ödeme Bilgileri
        doc.setFontSize(16);
        doc.text('Payment Information', 20, 135);
        doc.setFontSize(12);
        doc.text(`Number of Tickets: ${bookingDetails.noOfTickets}`, 20, 145);
        doc.text(`Total Cost: $${bookingDetails.totalCost}`, 20, 150);
        doc.text(`Name on Card: ${bookingDetails.nameOnCard}`, 20, 155);

        doc.save('booking-details.pdf');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!bookingDetails) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h5">No booking information available.</Typography>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Booking Successful!
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Booking ID: {bookingDetails.bookingId}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><strong>User Information</strong></Typography>
                        <Typography variant="body1">Name: {bookingDetails.user.firstName} {bookingDetails.user.lastName}</Typography>
                        <Typography variant="body1">Email: {bookingDetails.user.emailId}</Typography>
                        <Typography variant="body1">Phone: {bookingDetails.user.phoneNumber}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><strong>Show Details</strong></Typography>
                        <Typography variant="body1">Film: {bookingDetails.show.movie.name}</Typography>
                        <Typography variant="body1">Tür: {bookingDetails.show.movie.genre}</Typography>
                        <Typography variant="body1">Gösterim Tarihi: {bookingDetails.show.showDate}</Typography>
                        <Typography variant="body1">Gösterim Saati: {bookingDetails.show.showTime}</Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><strong>Cinema Details</strong></Typography>
                        <Typography variant="body1">Cinema: {bookingDetails.show.screen.theatre.nameOfTheatre}</Typography>
                        <Typography variant="body1">Location: {bookingDetails.show.screen.theatre.area}</Typography>
                        <Typography variant="body1">Screen : {bookingDetails.show.screen.screenId}</Typography>
                     </Grid>

                    <Grid item xs={6}>
                        <Typography variant="subtitle1"><strong>Payment Information</strong></Typography>
                        <Typography variant="body1">Number of Tickets: {bookingDetails.noOfTickets}</Typography>
                        <Typography variant="body1">Total Cost: ${bookingDetails.totalCost}</Typography>
                        <Typography variant="body1">Name on Card: {bookingDetails.nameOnCard}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                    <Button variant="contained" color="primary" onClick={downloadPDF} sx={{ marginRight: 2 }}>
                        Download PDF
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default BookingSuccess;
