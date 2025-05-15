// models/Medicine.js
const mongoose = require('mongoose');

const ConsumptionRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    consumed: { type: Boolean, default: false }
});

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timesPerDay: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeSlots: { type: [String], required: true },
    consumptionRecords: { type: [ConsumptionRecordSchema], default: [] }
});

module.exports = mongoose.model('Medicine', MedicineSchema);
