import React from 'react';
import { Card, Typography, Box } from '@mui/material';

const PaymentCard = ({ cardNumber, nameOnCard, expiryDate, cvv }) => {
    return (
        <Card sx={{ padding: 2, marginBottom: 4, backgroundColor: '#1976d2', color: '#fff' }}>
            <Typography variant="h6" gutterBottom>
                {nameOnCard || 'John Doe'}
            </Typography>
            <Typography variant="h5" gutterBottom>
                {cardNumber.replace(/(\d{4})/g, '$1 ').trim() || '**** **** **** ****'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">
                    {expiryDate || 'MM/YY'}
                </Typography>
                <Typography variant="body1">
                    {cvv ? '***' : ''}
                </Typography>
            </Box>
        </Card>
    );
};

export default PaymentCard;
