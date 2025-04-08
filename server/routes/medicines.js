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