
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
import UserService from "../../services/UserService"; // Assuming a similar service exists for users

export default function UserList() {
    const [users, setUsers] = useState([]); // Initialize users as an empty array
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        let userService = new UserService();
        userService
            .getAllUsers() // Assuming this method fetches user data
            .then((result) => {
                setUsers(result.data || []); // Safely handle possible undefined data
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch users:", error);
                setError("Failed to load users.");
                setLoading(false);
            });
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 25));
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
                            <TableCell>User ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                            <TableRow key={user.webUserId}>
                                <TableCell>
                                    <Link to={`/users/${user.webUserId}`}>
                                        {user.webUserId}
                                    </Link>
                                </TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.emailId}</TableCell>
                                <TableCell>{user.age}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <Link to={`/users/${user.webUserId}`}>
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
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
