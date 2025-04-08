import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Welcome to Medicine Scheduler</h1>
            <p className="mt-4">Manage your medication schedule easily.</p>
            <Link to="/login" className="mt-4 text-blue-500">Login</Link>
            <Link to="/signup" className="mt-2 text-blue-500">Signup</Link>
            <Link to="/scheduler" className="mt-2 text-blue-500">Demo Scheduler</Link>
        </div>
    );
};

export default Home;