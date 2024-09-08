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

export default function ScreenList() {
    const [screens, setScreens] = useState([]); // Screen verilerini tutmak için state
    const [theatres, setTheatres] = useState([]); // Theatre verilerini tutmak için state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true); // Yükleme durumu
    const [error, setError] = useState(null); // Hata durumu

    // Yeni screen eklemek için kullanılan state
    const [newScreen, setNewScreen] = useState({
        screenId: '',
        noOfSeatsGold: '',
        noOfSeatsSilver: '',
        theatreId: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewScreen({ ...newScreen, [name]: value });
    };

    const handleAddScreen = () => {
        // Seçilen theatreId'ye göre theatre bilgilerini bul
        const selectedTheatre = theatres.find(theatre => theatre.theatreId === newScreen.theatreId);

        if (!selectedTheatre) {
            alert("Please select a valid theatre.");
            return;
        }

        const newScreenWithDetails = {
            ...newScreen,
            theatre: selectedTheatre
        };

        // Yeni screen eklemek için API isteği
        apiClient.post("/screens", newScreenWithDetails)
            .then((response) => {
                setScreens([...screens, response.data]); // Yeni screen'i listeye ekle
                setNewScreen({ screenId: '', noOfSeatsGold: '', noOfSeatsSilver: '', theatreId: '' }); // Formu sıfırla
            })
            .catch((error) => {
                console.error("Failed to add screen:", error);
                alert("Failed to add screen. Please try again later.");
            });
    };

    useEffect(() => {
        apiClient
            .get("/screens/getAll") // Tüm ekran verilerini çeken API isteği
            .then((result) => {
                setScreens(result.data || []); // Gelen veriyi state'e atama
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch screens:", error);
                setError("Failed to load screens.");
                setLoading(false);
            });

        apiClient
            .get("/theatres/getAll") // Tüm theatre verilerini çeken API isteği
            .then((result) => {
                setTheatres(result.data || []); // Gelen veriyi state'e atama
            })
            .catch((error) => {
                console.error("Failed to fetch theatres:", error);
                setError("Failed to load theatres.");
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
                <h2>Yeni Ekran Ekle</h2>
                <TextField
                    label="Screen ID"
                    name="screenId"
                    value={newScreen.screenId}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    label="No. of Seats (Gold)"
                    name="noOfSeatsGold"
                    value={newScreen.noOfSeatsGold}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    label="No. of Seats (Silver)"
                    name="noOfSeatsSilver"
                    value={newScreen.noOfSeatsSilver}
                    onChange={handleInputChange}
                    sx={{ marginRight: 2 }}
                />
                <FormControl sx={{ marginRight: 2, minWidth: 200 }}>
                    <InputLabel>Theatre</InputLabel>
                    <Select
                        name="theatreId"
                        value={newScreen.theatreId}
                        onChange={handleInputChange}
                    >
                        {theatres.map((theatre) => (
                            <MenuItem key={theatre.theatreId} value={theatre.theatreId}>
                                {theatre.nameOfTheatre} - {theatre.area}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleAddScreen}>
                    Add Screen
                </Button>
            </Box>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Screen ID</TableCell>
                            <TableCell>No. of Seats (Gold)</TableCell>
                            <TableCell>No. of Seats (Silver)</TableCell>
                            <TableCell>Theatre Name</TableCell>
                            <TableCell>Area</TableCell>
                            <TableCell>No. of Screens</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {screens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((screen) => (
                            <TableRow key={screen.screenId}>
                                <TableCell>{screen.screenId}</TableCell>
                                <TableCell>{screen.noOfSeatsGold}</TableCell>
                                <TableCell>{screen.noOfSeatsSilver}</TableCell>
                                <TableCell>{screen.theatre?.nameOfTheatre || 'N/A'}</TableCell>
                                <TableCell>{screen.theatre?.area || 'N/A'}</TableCell>
                                <TableCell>{screen.theatre?.noOfScreens || 'N/A'}</TableCell>
                                <TableCell>
                                    <Link to={`/screens/${screen.screenId}`}>
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
                count={screens.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
