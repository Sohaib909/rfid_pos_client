import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const DatePicker = ({onDateChange, date=null}) => {
  const [selectedDate, setSelectedDate] = useState(date);

  const handleDateChange = (date) => {
    setSelectedDate(date)
    onDateChange(date)
  }

  return (
    <div style={{ margin: '20px' }}>
      <h3>Select a Date</h3>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
      />
      {selectedDate && (
        <p>
          You selected: {selectedDate.toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default DatePicker;
