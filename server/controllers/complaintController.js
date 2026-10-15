const getComplaintModel = require('../models/Complaint');

exports.createComplaint = async (req, res, next) => {
  try {
    const Complaint = getComplaintModel();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const complaintId = 'CMP-' + randomDigits;
    
    const newComplaint = await Complaint.create({
      ...req.body,
      complaintId,
      status: 'Submitted'
    });
    res.status(201).json({ success: true, data: newComplaint, message: 'Complaint submitted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const Complaint = getComplaintModel();
    let query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    const complaints = await Complaint.find(query);
    res.json({ success: true, data: complaints });
  } catch (err) {
    next(err);
  }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const Complaint = getComplaintModel();
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: complaint });
  } catch (err) {
    next(err);
  }
};

exports.trackComplaint = async (req, res, next) => {
  try {
    const Complaint = getComplaintModel();
    const { query } = req.params;
    const complaints = await Complaint.find({
      $or: [
        { complaintId: query },
        { phone: query }
      ]
    });
    res.json({ success: true, data: complaints });
  } catch (err) {
    next(err);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const Complaint = getComplaintModel();
    const { status } = req.body;
    if (!['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
       return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    let complaint;
    if (global.useMongoose) {
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
      } else {
        complaint = await Complaint.findOneAndUpdate({ complaintId: req.params.id }, { status }, { new: true });
      }
    } else {
      complaint = await Complaint.findByIdAndUpdate(req.params.id, { status });
    }

    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: { ...complaint, status } });
  } catch (err) {
    next(err);
  }
};
