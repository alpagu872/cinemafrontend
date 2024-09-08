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
    Box
} from "@mui/material";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient"; // API istemcisinin doğru yapılandırıldığını varsayıyorum

export default function TheatreList() {
    const [theatres, setTheatres] = useState([]); // Tiyatro verilerini tutmak için state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true); // Yükleme durumu
    const [error, setError] = useState(null); // Hata durumu

    // Yeni salon eklemek için kullanılan state'ler
    const [newTheatre, setNewTheatre] = useState({
        theatreId: '',
        nameOfTheatre: '',
        noOfScreens: '',
        area: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTheatre({ ...newTheatre, [name]: value });
    };

    const handleAddTheatre = () => {
        // Yeni salon eklemek için API isteği
        apiClient.post("/theatres", newTheatre)
            .then((response) => {
                setTheatres([...theatres, response.data]); // Yeni salonu listeye ekle
                setNewTheatre({ theatreId: '', nameOfTheatre: '', noOfScreens: '', area: '' }); // Formu sıfırla
            })
            .catch((error) => {
                console.error("Failed to add theatre:", error);
                alert("Failed to add theatre. Please try again later.");
            });
    };

    useEffect(() => {
        apiClient
            .get("/theatres/getAll") // Tüm tiyatro verilerini çeken API isteği
            .then((result) => {
                setTheatres(result.data || []); // Gelen veriyi state'e atama
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch theatres:", error);
                setError("Failed to load theatres.");
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
        return <div>Loading...</div>; // Yükleme sırasında gösterilecek mesaj
    }

    if (error) {
        return <div>{error}</div>; // Hata mesajı
    }

    return (
        <Paper sx={{ width: '100%', padding: 2 }}>
            <Box sx={{ marginBottom: 2 }}>
                <h2>Yeni Salon Ekle</h2>
                <TextField
                    label="Theatre ID"
                    name="theatreId"
                    value={newTheatre.theatreId}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    label="Name of Theatre"
                    name="nameOfTheatre"
                    value={newTheatre.nameOfTheatre}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    label="No. of Screens"
                    name="noOfScreens"
                    value={newTheatre.noOfScreens}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    label="Area"
                    name="area"
                    value={newTheatre.area}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddTheatre}>
                    Add Theatre
                </Button>
            </Box>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Theatre ID</TableCell>
                            <TableCell>Name of Theatre</TableCell>
                            <TableCell>No. of Screens</TableCell>
                            <TableCell>Area</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {theatres.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((theatre) => (
                            <TableRow key={theatre.theatreId}>
                                <TableCell>{theatre.theatreId}</TableCell>
                                <TableCell>{theatre.nameOfTheatre}</TableCell>
                                <TableCell>{theatre.noOfScreens}</TableCell>
                                <TableCell>{theatre.area}</TableCell>
                                <TableCell>
                                    <Link to={`/theatres/${theatre.theatreId}`}>
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
                count={theatres.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
