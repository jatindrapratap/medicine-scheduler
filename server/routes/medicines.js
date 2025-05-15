// routes/medicines.js
const express = require('express');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Middleware to protect routes

// Middleware to check if user is authenticated
router.use(authMiddleware);

// Add a new medicine
router.post('/', async (req, res) => {
    const { name, timesPerDay, durationDays, startDate, endDate, timeSlots } = req.body;
    const newMedicine = new Medicine({
        name,
        timesPerDay,
        durationDays,
        startDate,
        endDate,
        timeSlots,
        userId: req.user.id
    });

    try {
        await newMedicine.save();
        await User.findByIdAndUpdate(req.user.id, { $push: { medicines: newMedicine._id } });
        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(500).json({ message: 'Error adding medicine', error });
    }
});

// Get all medicines for the authenticated user
router.get('/', async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.user.id });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medicines', error });
    }
});

// Update consumption record for a medicine
router.put('/:id/consumption', async (req, res) => {
    const medicineId = req.params.id;
    const { date, timeSlot, consumed } = req.body;

    if (!date || !timeSlot || typeof consumed !== 'boolean') {
        return res.status(400).json({ message: 'Missing or invalid fields in request body' });
    }

    try {
        const medicine = await Medicine.findOne({ _id: medicineId, userId: req.user.id });
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // Find existing consumption record
        const recordIndex = medicine.consumptionRecords.findIndex(record =>
            record.date.toISOString().slice(0,10) === new Date(date).toISOString().slice(0,10) &&
            record.timeSlot === timeSlot
        );

        if (recordIndex !== -1) {
            // Update existing record
            medicine.consumptionRecords[recordIndex].consumed = consumed;
        } else {
            // Add new record
            medicine.consumptionRecords.push({ date: new Date(date), timeSlot, consumed });
        }

        await medicine.save();
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error updating consumption record', error });
    }
});

// Delete a medicine by ID
router.delete('/:id', async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(req.user.id, { $pull: { medicines: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medicine', error });
    }
});

// Delete all medicines for the authenticated user
router.delete('/', async (req, res) => {
    try {
        await Medicine.deleteMany({ userId: req.user.id });
        await User.findByIdAndUpdate(req.user.id, { $set: { medicines: [] } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medicines', error });
    }
});

module.exports = router;
