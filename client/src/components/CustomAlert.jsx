// CustomAlert.js
import React from 'react';
import { Alert } from '@mui/material';

const CustomAlert = ({ severity, message, onClose }) => {
    return (
        <Alert severity={severity} onClose={onClose} sx={{ mb: 2 }}>
            {message}
        </Alert>
    );
};

export default CustomAlert;