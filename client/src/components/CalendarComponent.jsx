// CalendarComponent.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ selectedDate, setSelectedDate, calendarEvents }) => {
    return (
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
    );
};

export default CalendarComponent;