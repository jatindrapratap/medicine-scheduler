import React, { useState, useContext, useMemo } from 'react';
import { Button, Container, Box, useMediaQuery } from '@mui/material';
import TopBar from '../components/TopBar';
import { MedicineContext } from '../context/MedicineContext';
import MedicineList from '../components/MedicineList';
import AddMedicineDialog from '../components/AddMedicineDialog';
import MedicineInfoModal from '../components/MedicineInfoModal';
import CalendarComponent from '../components/CalendarComponent';
import { useTheme } from '@mui/material/styles';

const MedicineScheduler = () => {
    const { medicines } = useContext(MedicineContext);
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenInfoModal = (medicine) => {
        setSelectedMedicine(medicine);
        setInfoModalOpen(true);
    };

    const handleCloseInfoModal = () => {
        setInfoModalOpen(false);
        setSelectedMedicine(null);
    };

    const calendarEvents = useMemo(() => {
        const events = medicines.flatMap(medicine => {
            const eventDates = [];
            const start = new Date(medicine.startDate);
            const duration = medicine.durationDays;

            for (let i = 0; i < duration; i++) {
                const eventDate = new Date(start.getTime());
                eventDate.setDate(eventDate.getDate() + i);
                eventDates.push(eventDate.toISOString().split('T')[0]); // ISO date string YYYY-MM-DD
            }
            return eventDates;
        });
        return events;
    }, [medicines]);

    return (
        <>
            <TopBar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box
                    display="flex"
                    flexDirection={isSmallScreen ? 'column' : 'row'}
                    gap={4}
                >
                    <Box flex={1}>
                        <CalendarComponent
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            calendarEvents={calendarEvents}
                        />
                    </Box>
                    <Box flex={1} display="flex" flexDirection="column">
                        <Box mb={3} display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={handleOpen}>
                                Add Medicine
                            </Button>
                        </Box>
                        <MedicineList
                            selectedDate={selectedDate}
                            handleOpenInfoModal={handleOpenInfoModal}
                        />
                    </Box>
                </Box>

                <AddMedicineDialog
                    open={open}
                    handleClose={handleClose}
                />

                <MedicineInfoModal
                    open={infoModalOpen}
                    handleClose={handleCloseInfoModal}
                    selectedMedicine={selectedMedicine}
                />
            </Container>
        </>
    );
};

export default MedicineScheduler;
