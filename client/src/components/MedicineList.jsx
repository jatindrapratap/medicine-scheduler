import React, { useMemo, useContext } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@mui/material';
import { MedicineContext } from '../context/MedicineContext';

const MedicineList = ({ selectedDate, handleOpenInfoModal }) => {
    const { medicines, deleteMedicine } = useContext(MedicineContext);
    // console.log("medicines:", medicines);

    // Memoize filtered medicines based on the selected date
    const filteredMedicines = useMemo(() => {
        return medicines.filter(medicine => {
            const startDate = new Date(medicine.startDate);
            // console.log("Start Date:", startDate.getTime());

            // Check if startDate is valid
            if (isNaN(startDate.getTime())) {
                console.error("Invalid startDate:", medicine.startDate);
                return false; // Skip this medicine if the start date is invalid
            }

            const durationDays = Number(medicine.durationDays);
            // console.log("Duration Days:", durationDays);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + durationDays - 1);
            // console.log("End Date:", endDate);

            // Ensure selectedDate is a Date object
            const selectedDateObj = new Date(selectedDate);
            // console.log("selected date:", selectedDateObj)
            if (isNaN(selectedDateObj.getTime())) {
                console.error("Invalid selectedDate:", selectedDate);
                return false; // Skip this medicine if the selected date is invalid
            }

            return (
                selectedDateObj.getDate() >= startDate.getDate() &&
                selectedDateObj.getDate() <= endDate.getDate()
            );
        });
    }, [medicines, selectedDate]); // Dependencies for useMemo

    // console.log("filteredMedicines", filteredMedicines);

    return (
        <div>
            {filteredMedicines.length > 0 ? ( // Check length instead of truthiness
                filteredMedicines.map((medicine) => (
                    <div key={medicine._id}> {/* Ensure each item has a unique key */}
                        <p>
                            {medicine.name}
                        </p>
                        <div>
                            Time Slots: {medicine.timeSlots.join(', ')}
                        </div>
                        <Button size="small" onClick={() => handleOpenInfoModal(medicine)}>
                            View Details
                        </Button>
                        <Button onClick={() => deleteMedicine(medicine._id)}>
                            Delete
                        </Button>
                    </div>
                ))
            ) : (
                <Typography variant="body1" color="text.secondary">
                    No medicines scheduled for this date.
                </Typography>
            )}
        </div>
    );
};

export default MedicineList;