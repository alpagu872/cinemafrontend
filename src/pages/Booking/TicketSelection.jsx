import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Box,
    Button,
    CircularProgress,
    TextField,
    InputAdornment
} from '@mui/material';

const TicketSelection = ({ bookingData, setBookingData }) => {
    const { showId } = useParams(); // showId parametresini URL'den al
    const [showDetails, setShowDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get(`/shows/${showId}`)
            .then(response => {
                setShowDetails(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch show details:', error);
                setError('Failed to load show details. Please try again later.');
                setLoading(false);
            });
    }, [showId]);

    const handleTicketChange = (event) => {
        setTicketCount(event.target.value);
    };

    const handleContinue = () => {
        const totalCost = ticketCount * (showDetails.classCostGold || 0);
        setBookingData({
            ...bookingData,
            showId,
            noOfTickets: ticketCount,
            totalCost,
        });

        console.log(bookingData, showId, ticketCount, totalCost);
        navigate('/payment');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Select Number of Tickets
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
                            image={"https://via.placeholder.com/200"} // Placeholder image
                            alt={`Show ${showId}`}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" align="center">
                                {new Date(showDetails.showDate).toLocaleDateString()} - {showDetails.showTime.hour}:{showDetails.showTime.minute}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Theatre: {showDetails.screen?.theatre?.nameOfTheatre || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Gold Seats Remaining: {showDetails.seatsRemainingGold}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Silver Seats Remaining: {showDetails.seatsRemainingSilver}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Cost per Gold Seat: {showDetails.classCostGold} USD
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <TextField
                                    label="Number of Tickets"
                                    type="number"
                                    value={ticketCount}
                                    onChange={handleTicketChange}
                                    InputProps={{
                                        inputProps: { min: 1, max: showDetails.seatsRemainingGold },
                                        startAdornment: <InputAdornment position="start">🎟️</InputAdornment>,
                                    }}
                                    variant="outlined"
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleContinue}
                                >
                                    Continue to Payment
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TicketSelection;
