// MedicineContext.js
import React, { createContext, useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_MEDICINE_SCHEDULER_MEDICINES_API;
import axios from 'axios';

export const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
    const [medicines, setMedicines] = useState([]);
    const [userToken, setUserToken] = useState(localStorage.getItem('token'));
    const mockMedicines = [
        { _id: '1', name: 'Aspirin', timesPerDay: 2, durationDays: 5, startDate: new Date(), endDate: null, timeSlots: ['08:00', '20:00'], description: 'Take after meals.' },
        { _id: '2', name: 'Ibuprofen', timesPerDay: 3, durationDays: 7, startDate: new Date(), endDate: null, timeSlots: ['09:00', '15:00', '21:00'], description: '' },
    ];

    useEffect(() => {
        fetchMedicines();
        // console.log(userToken)
        console.log("here")
    }, [userToken]);

    const fetchMedicines = async () => {
        
        try {
            const response = await axios.get(`${apiUrl}/medicines`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('Fetched medicines:', response.data); // Debugging
            setMedicines(response.data);
        } catch (error) {
            if (!userToken) {
                // Load mock data for demo
                
                setMedicines(mockMedicines);
                return;
            }
            console.error('Error fetching medicines:', error);
        }
        

    };

    const addMedicine = async (newMedicine) => {
        try {
            await axios.post(`${apiUrl}/medicines`, newMedicine, {
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
            await axios.delete(`${apiUrl}/medicines/${id}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            fetchMedicines();
        } catch (error) {
            console.error('Error deleting medicine:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUserToken(null)
        setMedicines(mockMedicines)
    }

    const setToken = () => {
        setUserToken(localStorage.getItem('token'))
    }


    return (
        <MedicineContext.Provider value={{ medicines, setMedicines, addMedicine, deleteMedicine, logout, setToken, userToken }}>
            {children}
        </MedicineContext.Provider>
    );
};
