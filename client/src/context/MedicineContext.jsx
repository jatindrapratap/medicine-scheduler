// MedicineContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
    const [medicines, setMedicines] = useState([]);
    const userToken = localStorage.getItem('token');

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        if (!userToken) {
            // Load mock data for demo
            const mockMedicines = [
                { _id: '1', name: 'Aspirin', timesPerDay: 2, durationDays: 5, startDate: new Date(), endDate: null, timeSlots: ['08:00', '20:00'], description: 'Take after meals.' },
                { _id: '2', name: 'Ibuprofen', timesPerDay: 3, durationDays: 7, startDate: new Date(), endDate: null, timeSlots: ['09:00', '15:00', '21:00'], description: '' },
            ];
            setMedicines(mockMedicines);
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/medicines', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setMedicines(response.data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    const addMedicine = async (newMedicine) => {
        try {
            await axios.post('http://localhost:5000/api/medicines', newMedicine, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log(newMedicine)
            fetchMedicines();
        } catch (error) {
            console.error('Error adding medicine:', error);
        }
    };

    const deleteMedicine = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/medicines/${id}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            fetchMedicines();
        } catch (error) {
            console.error('Error deleting medicine:', error);
        }
    };

    return (
        <MedicineContext.Provider value={{ medicines, addMedicine, deleteMedicine }}>
            {children}
        </MedicineContext.Provider>
    );
};