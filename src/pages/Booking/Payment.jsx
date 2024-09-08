import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import apiClient from '../../services/apiClient';
import PaymentCard from './PaymentCard';
import { useSelector } from 'react-redux';
import { selectUser } from '../../services/userSlice';

const Payment = ({ bookingData, setBookingData }) => {
    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userState = useSelector(selectUser);
    const user = userState.user;

    const handlePayment = async () => {
        if (!cardNumber || !nameOnCard || !expiryDate || !cvv) {
            setError("Please fill out all fields.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Show ve User bilgilerini veritabanından çekin
            const showResponse = await apiClient.get(`/shows/${bookingData.showId}`);
            const show = showResponse.data;

            const finalBookingData = {
                ...bookingData,
                cardNumber: cardNumber,
                nameOnCard: nameOnCard,
                user: {
                    webUserId: user.webUserId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailId: user.emailId,
                    age: user.age,
                    phoneNumber: user.phoneNumber,
                    username: user.username,
                    role: user.role,
                },
                show: {
                    showId: show.showId,
                    showDate: show.showDate,
                    showTime: show.showTime,
                    seatsRemainingGold: show.seatsRemainingGold,
                    seatsRemainingSilver: show.seatsRemainingSilver,
                    classCostGold: show.classCostGold,
                    classCostSilver: show.classCostSilver,
                    screen: show.screen,
                    movie: show.movie,
                }
            };

            const response = await apiClient.post('/bookings', finalBookingData);
            if (response.status === 201) {
                setLoading(false);
                console.log(response.data)
                const createdBookingId = response.data.bookingId; // Spring Boot'tan dönen bookingId
                navigate(`/bookingSuccess/${createdBookingId}`); // Yönlendirme yapılıyor
            }
        } catch (error) {
            setLoading(false);
            console.error('Payment failed:', error);
            setError('Payment failed. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 2,
            }}
        >
            <Card sx={{ maxWidth: 600, width: '100%', padding: 4 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                        Payment Details
                    </Typography>
                    <PaymentCard
                        cardNumber={cardNumber}
                        nameOnCard={nameOnCard}
                        expiryDate={expiryDate}
                        cvv={cvv}
                    />
                    {error && (
                        <Typography variant="body2" color="error" align="center">
                            {error}
                        </Typography>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Card Number"
                                fullWidth
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CreditCardIcon />
                                        </InputAdornment>
                                    ),
                                    inputProps: { maxLength: 16 },
                                }}
                                placeholder="1234 5678 9123 4567"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Name on Card"
                                fullWidth
                                value={nameOnCard}
                                onChange={(e) => setNameOnCard(e.target.value)}
                                placeholder="John Doe"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Expiry Date"
                                fullWidth
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                placeholder="MM/YY"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="CVV"
                                fullWidth
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="123"
                                variant="outlined"
                                type="password"
                                inputProps={{ maxLength: 3 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Pay Now'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Payment;
