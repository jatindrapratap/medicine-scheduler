// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MedicineScheduler from './pages/MedicineScheduler';
import LoginSignup from './pages/LoginSignup';
import { MedicineProvider } from './context/MedicineContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

const App = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MedicineProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/scheduler" />} />
                        <Route path="/login" element={<LoginSignup />} />
                        <Route path="/signup" element={<LoginSignup />} />
                        <Route path="/scheduler" element={<MedicineScheduler />} />
                    </Routes>
                </Router>
            </MedicineProvider>
        </ThemeProvider>
    );
};

export default App;
