import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Button, CircularProgress } from '@mui/material';

const ShowSelection = ({ bookingData, setBookingData }) => {
    const { movieId } = useParams(); // movieId parametresini URL'den al
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get(`/shows/shows/getByMovieId/${movieId}`)
            .then(response => {
                setShows(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch shows:', error);
                setError('Failed to load shows. Please try again later.');
                setLoading(false);
            });
    }, [movieId]);

    const handleShowSelect = (showId) => {
        setBookingData({ ...bookingData, showId });
        console.log(bookingData, showId)
        navigate(`/ticketSelection/${showId}`);
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
                Select a Show
            </Typography>
            <Grid container spacing={4}>
                {shows.map(show => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={show.showId}>
                        <Card sx={{ maxWidth: 345, mx: 'auto' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={"https://via.placeholder.com/200"} // Placeholder image for shows
                                alt={`Show ${show.showId}`}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" align="center">
                                    {new Date(show.showDate).toLocaleDateString()} - {show.showTime}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Theatre: {show.screen?.theatre?.nameOfTheatre || 'N/A'}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleShowSelect(show.showId)}
                                    >
                                        Select
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ShowSelection;
