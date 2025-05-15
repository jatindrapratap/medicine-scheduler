import React, { useMemo, useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Stack, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { MedicineContext } from '../context/MedicineContext';

const apiUrl = import.meta.env.VITE_MEDICINE_SCHEDULER_MEDICINES_API;

const MedicineList = ({ selectedDate, handleOpenInfoModal }) => {
  const { medicines, deleteMedicine, setMedicines, userToken } = useContext(MedicineContext);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [consumptionState, setConsumptionState] = useState({}); // { medicineId_timeSlot: boolean }

  // Memoize filtered medicines based on the selected date
  const filteredMedicines = useMemo(() => {
    return medicines.filter(medicine => {
      const startDate = new Date(medicine.startDate);

      if (isNaN(startDate.getTime())) {
        console.error("Invalid startDate:", medicine.startDate);
        return false;
      }

      const durationDays = Number(medicine.durationDays);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + durationDays - 1);

      // Normalize dates to midnight for accurate date-only comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const selectedDateObj = new Date(selectedDate);
      if (isNaN(selectedDateObj.getTime())) {
        console.error("Invalid selectedDate:", selectedDate);
        return false;
      }
      selectedDateObj.setHours(0, 0, 0, 0);

      return selectedDateObj >= startDate && selectedDateObj <= endDate;
    });
  }, [medicines, selectedDate]);

  // Group medicines by time slot
  const medicinesByTimeSlot = useMemo(() => {
    const grouping = {};
    filteredMedicines.forEach(medicine => {
      medicine.timeSlots.forEach(timeSlot => {
        if (!grouping[timeSlot]) {
          grouping[timeSlot] = [];
        }
        grouping[timeSlot].push(medicine);
      });
    });
    return grouping;
  }, [filteredMedicines]);

  // Initialize consumptionState from medicines consumptionRecords
  useEffect(() => {
    const newState = {};
    filteredMedicines.forEach(medicine => {
      medicine.timeSlots.forEach(timeSlot => {
        const record = medicine.consumptionRecords?.find(r =>
          new Date(r.date).toDateString() === new Date(selectedDate).toDateString() &&
          r.timeSlot === timeSlot
        );
        newState[`${medicine._id}_${timeSlot}`] = record ? record.consumed : false;
      });
    });
    setConsumptionState(newState);
  }, [filteredMedicines, selectedDate]);

  const handleDeleteClick = (medicine) => {
    setMedicineToDelete(medicine);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (medicineToDelete) {
      deleteMedicine(medicineToDelete._id);
    }
    setDeleteDialogOpen(false);
    setMedicineToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setMedicineToDelete(null);
  };

  const handleToggleConsumption = async (medicineId, timeSlot) => {
    const key = `${medicineId}_${timeSlot}`;
    const newConsumed = !consumptionState[key];
    setConsumptionState(prev => ({ ...prev, [key]: newConsumed }));

    try {
      await axios.put(`${apiUrl}/medicines/${medicineId}/consumption`, {
        date: selectedDate,
        timeSlot,
        consumed: newConsumed
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      // Refresh medicines from backend to sync state
      const response = await axios.get(`${apiUrl}/medicines`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setMedicines(response.data);
    } catch (error) {
      console.error('Error updating consumption status', error);
      // Revert state on error
      setConsumptionState(prev => ({ ...prev, [key]: !newConsumed }));
    }
  };

  return (
    <div>
      {Object.keys(medicinesByTimeSlot).length > 0 ? (
        Object.entries(medicinesByTimeSlot).sort().map(([timeSlot, meds]) => (
          <Card key={timeSlot} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AccessTimeIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                {timeSlot}
              </Typography>
              {meds.map(medicine => (
                <Stack key={medicine._id} direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!consumptionState[`${medicine._id}_${timeSlot}`]}
                        onChange={() => handleToggleConsumption(medicine._id, timeSlot)}
                      />
                    }
                    label={medicine.name}
                  />
                  <Button size="small" color="primary" onClick={() => handleOpenInfoModal(medicine)}>
                    Details
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(medicine)}>
                    Delete
                  </Button>
                </Stack>
              ))}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No medicines scheduled for this date.
        </Typography>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete {medicineToDelete ? medicineToDelete.name : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MedicineList;
