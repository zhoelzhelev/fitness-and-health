const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  carbohydrates: {type: Number, required: true, default: 0},
  fats: {type: Number, required: true, default: 0},
  proteins: {type: Number, required: true, default: 0},
  sodiums: {type: Number, required: true, default: 0},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);
