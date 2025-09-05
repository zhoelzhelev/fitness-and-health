const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['Male', 'Female'] },
  height: Number,
  weight: Number,
  carbohydrates: {type: Number, required: true, default: 0},
  fats: {type: Number, required: true, default: 0},
  sodiums: {type: Number, required: true, default: 0},
  proteins: {type: Number, required: true, default: 0},
  sugers: {type: Number, required: true,default: 0 },
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very-active', 'extra-active'] },
  dailyCalorieGoal: { type: Number, default: 0 },
  remainingCalories: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
