// MedicineList.js
import React, { useContext } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@mui/material';
import { MedicineContext } from '../context/MedicineContext';

const MedicineList = ({ selectedDate, handleOpenInfoModal }) => {
    const { medicines } = useContext(MedicineContext);

    // Filter medicines based on the selected date
    const filteredMedicines = medicines.filter(medicine => {
        const startDate = new Date(medicine.startDate);
        const endDate = medicine.endDate ? new Date(medicine.endDate) : null;
        return (
            selectedDate >= startDate && 
            (!endDate || selectedDate <= endDate)
        );
    });

    return (
        <Grid container spacing={2}>
            {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                    <Grid item xs={12} sm={6} md={4} key={medicine._id}>
                        <Card variant="outlined" sx={{ transition: '0.3s', '&:hover': { boxShadow: 3 } }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {medicine.name}
                                </Typography>
                                <Typography color="text.secondary">
                                    Times per Day: {medicine.timesPerDay}
                                </Typography>
                                <Typography color="text.secondary">
                                    Duration: {medicine.durationDays} days
                                </Typography>
                                <Typography color="text.secondary">
                                    Start Date: {new Date(medicine.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography color="text.secondary">
                                    End Date: {medicine.endDate ? new Date(medicine.endDate).toLocaleDateString() : 'N/A'}
                                </Typography>
                                <Typography color="text.secondary">
                                    Time Slots: {medicine.timeSlots.join(', ')}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleOpenInfoModal(medicine)}>
                                    View Details
                                </Button>
                                {/* Add more action buttons as needed */}
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="body1" color="text.secondary">
                    No medicines scheduled for this date.
                </Typography>
            )}
        </Grid>
    );
};

export default MedicineList;