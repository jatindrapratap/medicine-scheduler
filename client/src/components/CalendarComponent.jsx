import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box } from '@mui/material';

const formatDateToISO = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const CalendarComponent = ({ selectedDate, setSelectedDate, calendarEvents }) => {
    return (
        <Box sx={{ '& .react-calendar': { borderRadius: 2, border: '1px solid #1976d2' } }}>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date }) => {
                    const dateString = formatDateToISO(date); // Local date string YYYY-MM-DD
                    return calendarEvents.includes(dateString) ? (
                        <div style={{ color: '#1976d2', fontWeight: 'bold' }}>•</div> // Indicator for scheduled medicines
                    ) : null;
                }}
            />
        </Box>
    );
};

export default CalendarComponent;
