import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider } from '@mui/material';

const MedicineInfoModal = ({ open, handleClose, selectedMedicine }) => {
    if (!selectedMedicine) return null;

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="medicine-info-title" maxWidth="sm" fullWidth>
            <DialogTitle id="medicine-info-title">{selectedMedicine.name}</DialogTitle>
            <Divider />
            <DialogContent dividers>
                <Typography variant="body1" gutterBottom>
                    <strong>Times per day:</strong> {selectedMedicine.timesPerDay}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Duration (days):</strong> {selectedMedicine.durationDays}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Start Date:</strong> {new Date(selectedMedicine.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>End Date:</strong> {selectedMedicine.endDate ? new Date(selectedMedicine.endDate).toLocaleDateString() : 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Time Slots:</strong> {selectedMedicine.timeSlots.join(', ')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {selectedMedicine.description || 'No description provided.'}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MedicineInfoModal;
