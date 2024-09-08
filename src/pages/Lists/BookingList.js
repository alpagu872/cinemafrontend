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
import apiClient from "../../services/apiClient"; // API istemcisinin doğru yapılandırıldığını varsayıyorum

export default function BookingList() {
    const [bookings, setBookings] = useState([]); // Rezervasyon verilerini tutmak için state
    const [users, setUsers] = useState([]); // Kullanıcı verilerini tutmak için state
    const [shows, setShows] = useState([]); // Gösterim verilerini tutmak için state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Yeni rezervasyon eklemek için kullanılan state
    const [newBooking, setNewBooking] = useState({
        userId: '',
        showId: '',
        noOfTickets: '',
        totalCost: '',
        cardNumber: '',
        nameOnCard: '',
    });

    useEffect(() => {
        apiClient
            .get("/bookings/getAll")
            .then((result) => {
                setBookings(result.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch bookings:", error);
                setError("Failed to load bookings.");
                setLoading(false);
            });

        apiClient
            .get("/users/getAll")
            .then((result) => {
                setUsers(result.data || []);
            })
            .catch((error) => {
                console.error("Failed to fetch users:", error);
                setError("Failed to load users.");
            });

        apiClient
            .get("/shows/getAll")
            .then((result) => {
                setShows(result.data || []);
            })
            .catch((error) => {
                console.error("Failed to fetch shows:", error);
                setError("Failed to load shows.");
            });
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 25));
        setPage(0);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewBooking({ ...newBooking, [name]: value });
    };

    const handleAddBooking = () => {
        const selectedShow = shows.find(show => show.showId === newBooking.showId);
        const selectedUser = users.find(user => user.webUserId === newBooking.userId);

        if (!selectedShow || !selectedUser) {
            alert("Please select valid user and show.");
            return;
        }

        const updatedBooking = {
            ...newBooking,
            totalCost: newBooking.noOfTickets * (selectedShow.classCostGold + selectedShow.classCostSilver), // Örnek maliyet hesaplama
            user: selectedUser, // Seçilen kullanıcıyı ekle
            show: selectedShow, // Seçilen gösterimi ekle
        };

        apiClient.post("/bookings", updatedBooking)
            .then((response) => {
                setBookings([...bookings, response.data]);
                setNewBooking({
                    userId: '',
                    showId: '',
                    noOfTickets: '',
                    totalCost: '',
                    cardNumber: '',
                    nameOnCard: '',
                });
            })
            .catch((error) => {
                console.error("Failed to add booking:", error);
                alert("Failed to add booking. Please try again later.");
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Paper sx={{ width: '100%', padding: 2 }}>
            <Box sx={{ marginBottom: 2 }}>
                <h2>Yeni Rezervasyon Ekle</h2>
                <FormControl sx={{ marginRight: 2, minWidth: 200 }}>
                    <InputLabel>User</InputLabel>
                    <Select
                        name="userId"
                        value={newBooking.userId}
                        onChange={handleInputChange}
                    >
                        {users.map(user => (
                            <MenuItem key={user.webUserId} value={user.webUserId}>
                                {user.firstName} {user.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ marginRight: 2, minWidth: 200 }}>
                    <InputLabel>Show</InputLabel>
                    <Select
                        name="showId"
                        value={newBooking.showId}
                        onChange={handleInputChange}
                    >
                        {shows.map(show => (
                            <MenuItem key={show.showId} value={show.showId}>
                                {show.movie.name} - {show.showDate} {show.showTime}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Number of Tickets"
                    name="noOfTickets"
                    value={newBooking.noOfTickets}
                    onChange={handleInputChange}
                    type="number"
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={newBooking.cardNumber}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    label="Name on Card"
                    name="nameOnCard"
                    value={newBooking.nameOnCard}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddBooking}>
                    Add Booking
                </Button>
            </Box>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Booking ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Movie</TableCell>
                            <TableCell>Show Date</TableCell>
                            <TableCell>Show Time</TableCell>
                            <TableCell>Tickets</TableCell>
                            <TableCell>Total Cost</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => (
                            <TableRow key={booking.bookingId}>
                                <TableCell>{booking.bookingId}</TableCell>
                                <TableCell>{`${booking.user?.firstName || 'N/A'} ${booking.user?.lastName || 'N/A'}`}</TableCell>
                                <TableCell>
                                    <Link to={`/movies/${booking.show?.movie?.movieId}`}>
                                        {booking.show?.movie?.name || 'N/A'}
                                    </Link>
                                </TableCell>
                                <TableCell>{booking.show?.showDate || 'N/A'}</TableCell>
                                <TableCell>{booking.show?.showTime || 'N/A'}</TableCell>
                                <TableCell>{booking.noOfTickets}</TableCell>
                                <TableCell>${booking.totalCost}</TableCell>
                                <TableCell>
                                    <Link to={`/bookings/${booking.bookingId}`}>
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
                count={bookings.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
