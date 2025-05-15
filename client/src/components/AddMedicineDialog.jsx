// AddMedicineDialog.js
import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { MedicineContext } from '../context/MedicineContext';
import CustomAlert from './CustomAlert'; // Import the CustomAlert component

const AddMedicineDialog = ({ open, handleClose }) => {
    const { addMedicine } = useContext(MedicineContext);
    const [name, setName] = useState('');
    const [timesPerDay, setTimesPerDay] = useState(1);
    const [durationDays, setDurationDays] = useState(1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [description, setDescription] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [error, setError] = useState('');
    const [isUpdatingDuration, setIsUpdatingDuration] = useState(false);
    const [isUpdatingEndDate, setIsUpdatingEndDate] = useState(false);

    const handleAddMedicine = () => {
        // Validate input
        if (!name || !timesPerDay || !durationDays || !startDate) {
            setError('Please fill in all required fields.');
            return;
        }

        const newMedicine = { name, timesPerDay, durationDays, startDate, endDate, timeSlots, description };
        addMedicine(newMedicine);
        handleClose();
    };

    const getSuggestedTimeSlots = (times) => {
        const slots = [];
        const interval = 24 / times; // Calculate the interval in hours

        for (let i = 0; i < times; i++) {
            const hour = Math.floor(i * interval);
            const minute = (i * interval % 1) * 60; // Calculate minutes
            const formattedTime = `${String(hour).padStart(2, '0')}:${String(Math.round(minute)).padStart(2, '0')}`;
            slots.push(formattedTime);
        }
        return slots;
    };

    const handleTimesPerDayChange = (value) => {
        const times = Math.max(1, Math.min(10, value)); // Limit to 1-10 times
        setTimesPerDay(times);
        setTimeSlots(getSuggestedTimeSlots(times)); // Update time slots based on new value
    };

    // Update endDate when durationDays or startDate changes, if not updating endDate directly
    useEffect(() => {
        if (isUpdatingEndDate) {
            setIsUpdatingEndDate(false);
            return;
        }
        if (durationDays && startDate) {
            setIsUpdatingDuration(true);
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + Number(durationDays) - 1);
            setEndDate(newEndDate);
            setIsUpdatingDuration(false);
        }
    }, [durationDays, startDate]);

    // Update durationDays when endDate or startDate changes, if not updating durationDays directly
    useEffect(() => {
        if (isUpdatingDuration) {
            setIsUpdatingDuration(false);
            return;
        }
        if (endDate && startDate) {
            setIsUpdatingEndDate(true);
            const diffTime = endDate.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setDurationDays(diffDays > 0 ? diffDays : 1);
            setIsUpdatingEndDate(false);
        }
    }, [endDate, startDate]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Medicine</DialogTitle>
            <DialogContent>
                {error && <CustomAlert severity="error" message={error} onClose={() => setError('')} />} {/* Use CustomAlert */}
                <TextField
                    autoFocus
                    margin="dense"
                    label="Medicine Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError(''); // Clear error on input change
                    }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        margin="dense"
                        label="Times Per Day"
                        type="number"
                        fullWidth
                        value={timesPerDay}
                        onChange={(e) => handleTimesPerDayChange(e.target.value)}
                    />
                    <Tooltip title="Note: Currently, we only support up to 10 times per day for a single medicine. If you need more, consider adding another medicine with the same name and selecting time slots accordingly.">
                        <IconButton>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                {Array.from({ length: timesPerDay }).map((_, index) => (
                    <TextField
                        key={index}
                        margin="dense"
                        label={`Time Slot ${index + 1}`}
                        type="time"
                        fullWidth
                        value={timeSlots[index] || ''}
                        onChange={(e) => {
                            const newTimeSlots = [...timeSlots];
                            newTimeSlots[index] = e.target.value;
                            setTimeSlots(newTimeSlots);
                        }}
                    />
                ))}
                <TextField
                    margin="dense"
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                        setStartDate(new Date(e.target.value));
                        setError(''); // Clear error on input change
                    }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        margin="dense"
                        label="Duration (Days)"
                        type="number"
                        fullWidth
                        value={durationDays}
                        onChange={(e) => {
                            setDurationDays(e.target.value);
                            setError(''); // Clear error on input change
                        }}
                    />
                    <Tooltip title="End date will be automatically calculated based on the start date and duration. You can also set it manually if needed.">
                        <IconButton>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <TextField
                    margin="dense"
                    label="End Date (Auto-Calculated)"
                    type="date"
                    fullWidth
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                />
                <TextField
                    margin="dense"
                    label="Description (Optional)"
                    type="text"
                    fullWidth
                    placeholder="e.g., Take after meals, avoid drinking water for 30 minutes."
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setError(''); // Clear error on input change
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddMedicine} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMedicineDialog;