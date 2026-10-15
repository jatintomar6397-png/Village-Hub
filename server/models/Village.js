const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a village name'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'Please provide a district name']
    },
    tehsil: {
      type: String,
      default: ''
    },
    population: {
      type: String,
      default: '0'
    },
    problems: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Under Assessment'],
      default: 'Under Assessment'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    latitude: {
      type: Number,
      default: 28.65
    },
    longitude: {
      type: Number,
      default: 77.65
    },
    schools: {
      type: Number,
      default: 0
    },
    hospitals: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Village = mongoose.model('Village', villageSchema);

module.exports = Village;
