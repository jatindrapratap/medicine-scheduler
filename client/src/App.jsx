import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MedicineScheduler from './pages/MedicineScheduler';
import LoginSignup from './pages/LoginSignup';
import { MedicineProvider, MedicineContext } from './context/MedicineContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Blue
        },
        secondary: {
            main: '#dc004e', // Pinkish red
        },
        background: {
            default: '#f5f5f5', // Light grey background
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

const AppContent = () => {
    const { userToken } = useContext(MedicineContext);
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            {!userToken && open && (
                <Box sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1300, width: 300 }}>
                    <Alert
                        severity="info"
                        variant="filled"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={handleClose}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                        sx={{ justifyContent: 'space-between' }}
                    >
                        You are logged out. Please login to use all functionalities of the app.
                    </Alert>
                </Box>
            )}
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/scheduler" />} />
                    <Route path="/login" element={<LoginSignup />} />
                    <Route path="/signup" element={<LoginSignup />} />
                    <Route path="/scheduler" element={<MedicineScheduler />} />
                </Routes>
            </Router>
        </>
    );
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MedicineProvider>
                <AppContent />
            </MedicineProvider>
        </ThemeProvider>
    );
};

export default App;
