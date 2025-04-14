import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MedicineScheduler from './pages/MedicineScheduler';
import { MedicineProvider } from './context/MedicineContext'; // Import the MedicineProvider

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/scheduler" 
          element={
            <MedicineProvider>
              <MedicineScheduler />
            </MedicineProvider>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;