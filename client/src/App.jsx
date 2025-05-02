// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MedicineScheduler from './pages/MedicineScheduler'; // Import your MedicineScheduler component
import LoginSignup from './pages/LoginSignup'; // Import the combined Login/Signup component
import { MedicineProvider } from './context/MedicineContext'; // Import the MedicineProvider

const App = () => {
    const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated

    return (
        <MedicineProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/scheduler" />} />
                    <Route path="/login" element={<LoginSignup />} />
                    <Route path="/signup" element={<LoginSignup />} />
                    <Route path="/scheduler" element={<MedicineScheduler/>} />
                </Routes>
            </Router>
        </MedicineProvider>
    );
};

export default App;