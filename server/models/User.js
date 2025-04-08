// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }]
});

module.exports = mongoose.model('User ', UserSchema);