const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'Please provide the district'],
      trim: true
    },
    tehsil: {
      type: String,
      default: '',
      trim: true
    },
    village: {
      type: String,
      required: [true, 'Please provide the village name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    image: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Submitted'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

complaintSchema.pre('validate', function (next) {
  if (!this.complaintId) {
    this.complaintId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
