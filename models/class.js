// models/game.js
const mongoose = require('../config/database')
const { Schema } = mongoose

const reviewSchema = new Schema({
  review:       { type: String },
  description:  { type: String },
  date:         { type: Date, default: Date.now },
});

const studentSchema = new Schema({
  name:       { type: String },
  picture:    { type: String },
  reviews:    [reviewSchema],
  lastReview: { type: String },
});

const classSchema = new Schema({
  name:       { type: String},
  students:   [studentSchema],
  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now },
  startDate:  { type: Date, default: Date.now },
  endDate:    { type: Date },
});

module.exports = mongoose.model('classes', classSchema)
