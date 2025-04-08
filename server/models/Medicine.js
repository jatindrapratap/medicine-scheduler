// models/Medicine.js
const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timesPerDay: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' }
});

module.exports = mongoose.model('Medicine', MedicineSchema);