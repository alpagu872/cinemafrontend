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
    TextField,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import { Link } from "react-router-dom";
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import apiClient from "../../services/apiClient";

export default function ShowList() {
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Yeni gösterim eklemek için kullanılan state
    const [newShow, setNewShow] = useState({
        showTime: dayjs(),
        showDate: '',
        seatsRemainingGold: '',
        seatsRemainingSilver: '',
        classCostGold: '',
        classCostSilver: '',
        screenId: '',
        movieId: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewShow({ ...newShow, [name]: value });
    };

    const handleTimeChange = (time) => {
        setNewShow({ ...newShow, showTime: time });
    };

    const handleAddShow = () => {
        const formattedShowTime = newShow.showTime ? newShow.showTime.format('HH:mm:ss') : '';

        const showData = {
            ...newShow,
            showTime: formattedShowTime,
        };

        console.log("Adding show with data:", showData);

        if (!newShow.screenId || !newShow.movieId) {
            alert("Please select a valid screen and movie.");
            return;
        }

        apiClient.post("/shows", showData)
            .then((response) => {
                setShows([...shows, response.data]);
                setNewShow({
                    showTime: dayjs(),
                    showDate: '',
                    seatsRemainingGold: '',
                    seatsRemainingSilver: '',
                    classCostGold: '',
                    classCostSilver: '',
                    screenId: '',
                    movieId: '',
                });
            })
            .catch((error) => {
                console.error("Failed to add show:", error);
                alert("Failed to add show. Please try again later.");
            });
    };

    useEffect(() => {
        apiClient
            .get("/shows/getAll")
            .then((result) => {
                setShows(result.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch shows:", error);
                setError("Failed to load shows.");
                setLoading(false);
            });

        apiClient
            .get("/movies/getAll")
            .then((result) => {
                setMovies(result.data || []);
            })
            .catch((error) => {
                console.error("Failed to fetch movies:", error);
                setError("Failed to load movies.");
            });

        apiClient
            .get("/screens/getAll")
            .then((result) => {
                setScreens(result.data || []);
            })
            .catch((error) => {
                console.error("Failed to fetch screens:", error);
                setError("Failed to load screens.");
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper sx={{ width: '100%', padding: 2 }}>
                <Box sx={{ marginBottom: 2 }}>
                    <h2>Yeni Gösterim Ekle</h2>
                    <TimePicker
                        label="Show Time"
                        value={newShow.showTime}
                        onChange={handleTimeChange}
                        renderInput={(params) => <TextField {...params} sx={{ marginRight: 2 }} />}
                    />
                    <TextField
                        label="Show Date"
                        name="showDate"
                        value={newShow.showDate}
                        onChange={handleInputChange}
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ marginRight: 2 }}
                    />
                    <TextField
                        label="Seats Remaining (Gold)"
                        name="seatsRemainingGold"
                        value={newShow.seatsRemainingGold}
                        onChange={handleInputChange}
                        type="number"
                        sx={{ marginRight: 2 }}
                    />
                    <TextField
                        label="Seats Remaining (Silver)"
                        name="seatsRemainingSilver"
                        value={newShow.seatsRemainingSilver}
                        onChange={handleInputChange}
                        type="number"
                        sx={{ marginRight: 2 }}
                    />
                    <TextField
                        label="Class Cost (Gold)"
                        name="classCostGold"
                        value={newShow.classCostGold}
                        onChange={handleInputChange}
                        type="number"
                        sx={{ marginRight: 2 }}
                    />
                    <TextField
                        label="Class Cost (Silver)"
                        name="classCostSilver"
                        value={newShow.classCostSilver}
                        onChange={handleInputChange}
                        type="number"
                        sx={{ marginRight: 2 }}
                    />
                    <FormControl sx={{ marginRight: 2, minWidth: 200 }}>
                        <InputLabel>Screen</InputLabel>
                        <Select
                            name="screenId"
                            value={newShow.screenId}
                            onChange={handleInputChange}
                        >
                            {screens.map(screen => (
                                <MenuItem key={screen.screenId} value={screen.screenId}>
                                    {screen.screenId} - {screen.theatre?.nameOfTheatre || 'N/A'}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ marginRight: 2, minWidth: 200 }}>
                        <InputLabel>Movie</InputLabel>
                        <Select
                            name="movieId"
                            value={newShow.movieId}
                            onChange={handleInputChange}
                        >
                            {movies.map(movie => (
                                <MenuItem key={movie.movieId} value={movie.movieId}>
                                    {movie.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleAddShow}>
                        Add Show
                    </Button>
                </Box>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Show ID</TableCell>
                                <TableCell>Show Time</TableCell>
                                <TableCell>Show Date</TableCell>
                                <TableCell>Seats Remaining (Gold)</TableCell>
                                <TableCell>Seats Remaining (Silver)</TableCell>
                                <TableCell>Class Cost (Gold)</TableCell>
                                <TableCell>Class Cost (Silver)</TableCell>
                                <TableCell>Screen ID</TableCell>
                                <TableCell>Movie ID</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((show) => (
                                <TableRow key={show.showId}>
                                    <TableCell>{show.showId}</TableCell>
                                    <TableCell>{show.showTime}</TableCell>
                                    <TableCell>{show.showDate}</TableCell>
                                    <TableCell>{show.seatsRemainingGold}</TableCell>
                                    <TableCell>{show.seatsRemainingSilver}</TableCell>
                                    <TableCell>{show.classCostGold}</TableCell>
                                    <TableCell>{show.classCostSilver}</TableCell>
                                    <TableCell>{show.screen?.screenId || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Link to={`/movies/${show.movie?.movieId || ''}`}>
                                            {show.movie?.movieId || 'N/A'}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/shows/${show.showId}`}>
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
                    count={shows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </LocalizationProvider>
    );
}
