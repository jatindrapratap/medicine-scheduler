// MedicineInfoModal.js
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const MedicineInfoModal = ({ open, handleClose, selectedMedicine }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{selectedMedicine ? selectedMedicine.name : 'Medicine Details'}</DialogTitle>
      <DialogContent>
        {selectedMedicine ? (
          <>
            <p><strong>Times Per Day:</strong> {selectedMedicine.timesPerDay}</p>
            <p><strong>Duration (Days):</strong> {selectedMedicine.durationDays}</p>
            <p><strong>Start Date:</strong> {new Date(selectedMedicine.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {selectedMedicine.endDate ? new Date(selectedMedicine.endDate).toLocaleDateString() : 'N/A'}</p>
            {/* <p><strong>Time Slots:</strong> {selectedMedicine.timeSlots}</p> */}
            <p><strong>Time Slots:</strong> {selectedMedicine.timeSlots.join(', ')}</p>
            <p><strong>Description:</strong> {selectedMedicine.description || 'No description provided.'}</p>
          </>
        ) : (
          <p>No details available.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicineInfoModal;