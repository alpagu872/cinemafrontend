import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import MovieService from "../../services/MovieService"; // Assuming a similar service exists for movies

export default function MovieList() {
    const [movies, setMovies] = useState([]); // Ensure movies is initialized as an empty array
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    useEffect(() => {
        let movieService = new MovieService();
        movieService
            .getAllMovies() // Assuming this method fetches movie data
            .then((result) => {
                setMovies(result.data || []); // Safely handle possible undefined data
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch movies:", error);
                setError("Failed to load movies.");
                setLoading(false);
            });
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <div>Loading...</div>; // Render loading indicator
    }

    if (error) {
        return <div>{error}</div>; // Render error message
    }

    return (
        <Paper sx={{ width: '100%' }}>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Movie ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Target Audience</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((movie) => (
                            <TableRow key={movie.movieId}>
                                <TableCell>
                                    <Link to={`/movies/${movie.movieId}`}>
                                        {movie.movieId}
                                    </Link>
                                </TableCell>
                                <TableCell>{movie.name}</TableCell>
                                <TableCell>{movie.language}</TableCell>
                                <TableCell>{movie.genre}</TableCell>
                                <TableCell>{movie.targetAudience}</TableCell>
                                <TableCell>
                                    <Link to={`/movies/${movie.movieId}`}>
                                        <Button variant="contained" color="primary">
                                            View Details
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={movies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
