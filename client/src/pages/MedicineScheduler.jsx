// MedicineScheduler.js
import React, { useState, useContext } from 'react';
import { Button } from '@mui/material';
import TopBar from '../components/TopBar'
import { MedicineContext } from '../context/MedicineContext';
import MedicineList from '../components/MedicineList';
import AddMedicineDialog from '../components/AddMedicineDialog';
import MedicineInfoModal from '../components/MedicineInfoModal';
import CalendarComponent from '../components/CalendarComponent';

const MedicineScheduler = () => {
  const { medicines } = useContext(MedicineContext);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

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

  return (
    <div className="p-4">
      <TopBar /> {/* Include the TopBar here */}
      <h1 className="text-2xl font-bold mb-4">Medicine Scheduler</h1>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Medicine
      </Button>
      <CalendarComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        calendarEvents={calendarEvents}
      />
      <MedicineList
        selectedDate={selectedDate}
        handleOpenInfoModal={handleOpenInfoModal}
      />
      <AddMedicineDialog
        open={open}
        handleClose={handleClose}
      />
      <MedicineInfoModal
        open={infoModalOpen}
        handleClose={handleCloseInfoModal}
        selectedMedicine={selectedMedicine}
      />
    </div>
  );
};

export default MedicineScheduler;