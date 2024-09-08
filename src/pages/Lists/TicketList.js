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
import apiClient from "../../services/apiClient"; // API istemcisinin doğru yapılandırıldığını varsayıyorum

export default function TicketList() {
    const [tickets, setTickets] = useState([]); // Bilet verilerini tutmak için state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0); // Toplam eleman sayısı için state
    const [loading, setLoading] = useState(true); // Yükleme durumu
    const [error, setError] = useState(null); // Hata durumu

    const fetchTickets = (page, size) => {
        apiClient
            .get(`/tickets/getAll?page=${page}&size=${size}`) // page ve size parametreleri ile API isteği
            .then((result) => {
                setTickets(result.data.content || []); // Gelen veriyi state'e atama
                setTotalElements(result.data.totalElements); // Toplam eleman sayısını güncelleme
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch tickets:", error);
                setError("Failed to load tickets.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTickets(page, rowsPerPage); // İlk yüklemede mevcut sayfa ve satır sayısına göre veriyi çek
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage); // Sayfa değiştiğinde yeni sayfayı ayarla
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); // Sayfa başına satır sayısını ayarla
        setPage(0); // Satır sayısı değiştiğinde sayfayı sıfırla
    };

    if (loading) {
        return <div>Loading...</div>; // Yükleme sırasında gösterilecek mesaj
    }

    if (error) {
        return <div>{error}</div>; // Hata mesajı
    }

    return (
        <Paper sx={{ width: '100%' }}>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ticket ID</TableCell>
                            <TableCell>Booking ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Show Date</TableCell>
                            <TableCell>Show Time</TableCell>
                            <TableCell>Movie</TableCell>
                            <TableCell>Theatre</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Class</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.ticketId}>
                                <TableCell>{ticket.ticketId}</TableCell>
                                <TableCell>{ticket.booking?.bookingId || 'N/A'}</TableCell>
                                <TableCell>{`${ticket.booking?.user?.firstName || 'N/A'} ${ticket.booking?.user?.lastName || 'N/A'}`}</TableCell>
                                <TableCell>{ticket.booking?.show?.showDate || 'N/A'}</TableCell>
                                <TableCell>{ticket.booking?.show ? `${ticket.booking.show.showTime}` : 'N/A'}</TableCell>
                                <TableCell>{ticket.booking?.show?.movie?.name || 'N/A'}</TableCell>
                                <TableCell>{ticket.booking?.show?.screen?.theatre?.nameOfTheatre || 'N/A'}</TableCell>
                                <TableCell>${ticket.price}</TableCell>
                                <TableCell>{ticket.ticketClass}</TableCell>
                                <TableCell>
                                    <Link to={`/tickets/${ticket.ticketId}`}>
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
                count={totalElements} // Toplam eleman sayısını buraya ekleyin
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
