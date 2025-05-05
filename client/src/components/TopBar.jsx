// src/components/TopBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { MedicineContext } from '../context/MedicineContext';
import { useContext} from 'react'

const TopBar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated
    const { logout } = useContext(MedicineContext);
    const handleLogout = () => {
        logout();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Medicine Scheduler
                </Typography>
                {isAuthenticated ? (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/signup')}>
                            Signup
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;