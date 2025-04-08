import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // Import the Info icon
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TopBar from '../components/TopBar'; // Import the TopBar component

const MedicineScheduler = () => {
    const [medicines, setMedicines] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [timesPerDay, setTimesPerDay] = useState(1);
    const [durationDays, setDurationDays] = useState(1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [userToken, setUserToken] = useState(localStorage.getItem('token'));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [scheduleForSelectedDate, setScheduleForSelectedDate] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [description, setDescription] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    useEffect(() => {
        fetchMedicines();
    }, []);

    useEffect(() => {
        updateScheduleForDate(selectedDate);
    }, [selectedDate, medicines]);

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

    const handleAddMedicine = async () => {
        const newMedicine = { name, timesPerDay, durationDays, startDate, endDate, timeSlots, description };
        try {
            await axios.post('http://localhost:5000/api/medicines', newMedicine, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            fetchMedicines();
            handleClose();
        } catch (error) {
            console.error('Error adding medicine:', error);
        }
    };

    const handleDeleteMedicine = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/medicines/${id}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            fetchMedicines();
        } catch (error) {
            console.error('Error deleting medicine:', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        setTimeSlots(getSuggestedTimeSlots(timesPerDay)); // Prefill time slots based on timesPerDay
    };

    const handleClose = () => {
        setOpen(false);
        setName('');
        setTimesPerDay(1);
        setDurationDays(1);
        setStartDate(new Date());
        setEndDate(null);
        setDescription('');
        setTimeSlots([]); // Reset time slots
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

    const updateScheduleForDate = (date) => {
        const formattedDate = date.toDateString();
        const schedule = medicines.filter(medicine => {
            const start = new Date(medicine.startDate);
            const duration = medicine.durationDays;

            for (let i = 0; i < duration; i++) {
                const eventDate = new Date(start);
                eventDate.setDate(start.getDate() + i);
                if (eventDate.toDateString() === formattedDate) {
                    return true;
                }
            }
            return false;
        });
        setScheduleForSelectedDate(schedule);
    };

    const getCalendarEvents = () => {
        return medicines.flatMap(medicine => {
            const events = [];
            const start = new Date(medicine.startDate);
            const duration = medicine.durationDays;

            for (let i = 0; i < duration; i++) {
                const eventDate = new Date(start);
                eventDate.setDate(start.getDate() + i);
                events.push(eventDate.toDateString());
            }
            return events;
        });
    };

    const calendarEvents = getCalendarEvents();

    // Function to handle time slot changes
    const handleTimeSlotChange = (index, value) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[index] = value;
        setTimeSlots(newTimeSlots);
    };

    // Function to open the info modal
    const handleOpenInfoModal = (medicine) => {
        setSelectedMedicine(medicine);
        setInfoModalOpen(true);
        
    };

    // Function to close the info modal
    const handleCloseInfoModal = () => {
        setInfoModalOpen(false);
        setSelectedMedicine(null);
    };

    return (
        <div className="p-4">
            <TopBar /> {/* Include the TopBar here */}
            <h1 className="text-2xl font-bold mb-4">Medicine Scheduler</h1>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Medicine
            </Button>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date }) => {
                    const dateString = date.toDateString();
                    return calendarEvents.includes(dateString) ? (
                        <div style={{ color: 'red' }}>•</div> // Indicator for scheduled medicines
                    ) : null;
                }}
            />
            <div className="mt-4">
                <h2 className="text-xl">Scheduled Medicines for {selectedDate.toDateString()}</h2>
                <ul>
                    {scheduleForSelectedDate.length > 0 ? (
                        scheduleForSelectedDate.map((medicine) => (
                            <li key={medicine._id} className="flex justify-between items-center">
                                <span onClick={() => handleOpenInfoModal(medicine)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                                    {medicine.name} - {medicine.timesPerDay} times per day
                                </span>
                                <Button variant="outlined" color="secondary" onClick={() => handleDeleteMedicine(medicine._id)}>
                                    Delete
                                </Button>
                            </li>
                        ))
                    ) : (
                        <li>No medicines scheduled for this date.</li>
                    )}
                </ul>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Medicine</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Medicine Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            margin="dense"
                            label="Times Per Day"
                            type="number"
                            fullWidth
                            value={timesPerDay}
                            onChange={(e) => {
                                const value = Math.max(1, Math.min(10, e.target.value)); // Limit to 1-10 times
                                setTimesPerDay(value);
                                setTimeSlots(getSuggestedTimeSlots(value)); // Update time slots based on new value
                            }}
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
                            onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                        />
                    ))}
                    <TextField
                        margin="dense"
                        label="Duration (Days)"
                        type="number"
                        fullWidth
                        value={durationDays}
                        onChange={(e) => setDurationDays(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Start Date"
                        type="date"
                        fullWidth
                        value={startDate.toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                    />
                    <TextField
                        margin="dense"
                        label="End Date (Optional)"
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
                        onChange={(e) => setDescription(e.target.value)}
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

            {/* Info Modal for Medicine Details */}
            <Dialog open={infoModalOpen} onClose={handleCloseInfoModal}>
                <DialogTitle>{selectedMedicine ? selectedMedicine.name : 'Medicine Details'}</DialogTitle>
                <DialogContent>
                    {selectedMedicine ? (
                        <>
                            <p><strong>Times Per Day:</strong> {selectedMedicine.timesPerDay}</p>
                            <p><strong>Duration (Days):</strong> {selectedMedicine.durationDays}</p>
                            <p><strong>Start Date:</strong> {new Date(selectedMedicine.startDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {selectedMedicine.endDate ? new Date(selectedMedicine.endDate).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Time Slots:</strong> {selectedMedicine.timeSlots.join(', ')}</p>
                            <p><strong>Description:</strong> {selectedMedicine.description || 'No description provided.'}</p>
                        </>
                    ) : (
                        <p>No details available.</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInfoModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MedicineScheduler;