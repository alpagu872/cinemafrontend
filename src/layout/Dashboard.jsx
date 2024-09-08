import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import MovieList from "../pages/Lists/MovieList";
import {Route, Routes} from "react-router-dom";
import Categories from "./Categories";
import {Box} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AddFilm from "../pages/AddFilm";
import MovieDetails from "../pages/Details/MovieDetails";
import UserList from "../pages/Lists/UserList";
import UserDetails from "../pages/Details/UserDetails";
import Register from "../pages/Auth/Register";
import BookingList from "../pages/Lists/BookingList";
import ShowList from "../pages/Lists/ShowList";
import ShowDetails from "../pages/Details/ShowDetails";
import BookingDetail from "../pages/Details/BookingDetails";
import ScreenList from "../pages/Lists/ScreenList";
import TheatreList from "../pages/Lists/TheatreList";
import TicketList from "../pages/Lists/TicketList";
import TicketDetail from "../pages/Details/TicketDetails";
import TheatreDetails from "../pages/Details/TheatreDetails";
import ScreenDetails from "../pages/Details/ScreenDetails";
import UserInfo from "../pages/userInfo";
import { selectUser } from '../services/userSlice';
import {useSelector} from "react-redux";
import Payment from "../pages/Booking/Payment";
import BookingSuccess from "../pages/Booking/BookingSuccess";
import TicketSelection from "../pages/Booking/TicketSelection";
import ShowSelection from "../pages/Booking/ShowSelection";
import MovieSelection from "../pages/Booking/MovieSelection";

const Dashboard = () => {
    const userState = useSelector(selectUser);
    const user = userState.user; // Access the nested user object

    const [bookingData, setBookingData] = useState({
        movieId: '',
        showId: '',
        noOfTickets: 1,
        totalCost: 0,
        cardNumber: '',
        nameOnCard: ''
    });

    console.log("User Object:", user);
    console.log("User Role:", user?.role);
    console.log("Is Admin:", user?.role === "ADMIN");
    console.log("Is User:", user?.role === "USER");

    const renderAdminRoutes = () => (
        <Routes>
            <Route path="/movieList" element={<MovieList />} />
            <Route path="/addFilm" element={<AddFilm />} />
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            <Route path="/userList" element={<UserList />} />
            <Route path="/users/:webUserId" element={<UserDetails />} />
            <Route path="/bookingList" element={<BookingList />} />
            <Route path="/showList" element={<ShowList />} />
            <Route path="/shows/:showId" element={<ShowDetails />} />
            <Route path="/bookings/:bookingId" element={<BookingDetail />} />
            <Route path="/tickets/:ticketId" element={<TicketDetail />} />
            <Route path="/screenList" element={<ScreenList />} />
            <Route path="/screens/:screenId" element={<ScreenDetails />} />
            <Route path="/theatreList" element={<TheatreList />} />
            <Route path="/theatres/:theatreId" element={<TheatreDetails />} />
            <Route path="/ticketList" element={<TicketList />} />
            <Route path="/userInfo" element={<UserInfo />} />

            <Route path="/movieSelection" element={<MovieSelection bookingData={bookingData} setBookingData={setBookingData} />} />
            <Route path="/showSelection/:movieId" element={<ShowSelection bookingData={bookingData} setBookingData={setBookingData} />} />
            <Route path="/ticketSelection/:showId" element={<TicketSelection bookingData={bookingData} setBookingData={setBookingData} />} />
            <Route path="/payment" element={<Payment bookingData={bookingData} setBookingData={setBookingData} />} />
            <Route path="/bookingSuccess/:bookingId" element={<BookingSuccess />} />

        </Routes>
    );

    const renderUserRoutes = () => (
        <Routes>
            <Route path="/" element={<UserInfo />} />
            <Route path="/userInfo" element={<UserInfo />} />
            <Route path="/bookingSuccess/:bookingId" element={<BookingSuccess />} />

            <Route path="/movieSelection" element={<MovieSelection bookingData={bookingData} setBookingData={setBookingData} />} />
            <Route path="/showSelection/:movieId" element={<ShowSelection bookingData={bookingData} setBookingData={setBookingData} />} />
            <Route path="/ticketSelection/:showId" element={<TicketSelection bookingData={bookingData} setBookingData={setBookingData} />} />
            <Route path="/payment" element={<Payment bookingData={bookingData} setBookingData={setBookingData} />} />
            <Route path="/bookingSuccess" element={<BookingSuccess />} />

        </Routes>
    );

    const renderCategories = () => (<div>
        <Categories/>
    </div>);


    if (!user || !user.role) {
        return <h1 style={{ textAlign: 'center', color: 'red' }}>Unauthorized access</h1>;
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid2 container spacing={2} columns={16}>

                        <Grid2 item xs={2}>
                            {renderCategories()}
                        </Grid2>

                    <Grid2 item xs={14}>
                        {user.role === "ADMIN" ? (
                            renderAdminRoutes()
                        ) : user.role === "USER" ? (
                            renderUserRoutes()
                        ) : (
                            <h1 style={{ textAlign: 'center', color: 'red' }}>Unauthorized access</h1>
                        )}
                    </Grid2>
                </Grid2>
            </Box>
        </div>
    );
};
export default Dashboard;
