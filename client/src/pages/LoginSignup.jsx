import React, { useState, useContext } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Snackbar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MedicineContext } from '../context/MedicineContext';
const apiUrl = import.meta.env.VITE_MEDICINE_SCHEDULER_MEDICINES_API;

const LoginSignup = () => {
    const { setToken } = useContext(MedicineContext);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateInput()) return;
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            setToken();
            navigate('/scheduler');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
            console.log(error);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateInput()) return;
        try {
            await axios.post(`${apiUrl}/auth/signup`, { username, password });
            setIsLogin(true);
        } catch (error) {
            setError('Signup failed. Please try again.');
        }
    };

    const validateInput = () => {
        if (username.length < 3) {
            setError('Username must be at least 3 characters long.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        return true;
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h5" component="h1" gutterBottom>
                {isLogin ? 'Login' : 'Signup'}
            </Typography>
            <Box component="form" onSubmit={isLogin ? handleLogin : handleSignup} sx={{ width: '100%' }}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    {isLogin ? 'Login' : 'Signup'}
                </Button>
                <Button
                    variant="text"
                    onClick={() => setIsLogin(!isLogin)}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    {isLogin ? "Don't have an account? Signup" : 'Already have an account? Login'}
                </Button>
            </Box>
            {error && (
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                    message={error}
                />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Username Tips:</strong> Must be at least 3 characters long.
            </Typography>
            <Typography variant="body2" color="text.secondary">
                <strong>Password Tips:</strong> Must be at least 6 characters long.
            </Typography>
        </Container>
    );
};

export default LoginSignup;
