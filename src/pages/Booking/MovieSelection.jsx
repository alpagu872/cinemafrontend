import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Button } from '@mui/material';

const MovieSelection = ({ bookingData, setBookingData }) => {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get('/movies/getAll')
            .then(response => setMovies(response.data))
            .catch(error => console.error('Failed to fetch movies:', error));
    }, []);

    const handleMovieSelect = (movieId) => {
        setBookingData({ ...bookingData, movieId });
        console.log(bookingData, movieId);
        navigate(`/showSelection/${movieId}`);
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Select a Movie
            </Typography>
            <Grid container spacing={4}>
                {movies.map(movie => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.movieId}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={movie.posterUrl || "https://via.placeholder.com/140"} // Assuming posterUrl exists, otherwise using a placeholder
                                alt={movie.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {movie.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {movie.genre} | {movie.language}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleMovieSelect(movie.movieId)}
                                >
                                    Select
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MovieSelection;
