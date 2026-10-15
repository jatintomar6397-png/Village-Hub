const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide applicant name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide applicant email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    village: {
      type: String,
      required: [true, 'Please provide village name'],
      trim: true
    },
    requestedRole: {
      type: String,
      default: 'Volunteer',
      trim: true
    },
    message: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
