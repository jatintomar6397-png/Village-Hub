const getApplicationModel = require('../models/Application');

exports.createApplication = async (req, res, next) => {
  try {
    const Application = getApplicationModel();
    const newApp = await Application.create({ ...req.body, status: 'Pending' });
    res.status(201).json({ success: true, data: newApp });
  } catch (err) {
    next(err);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const Application = getApplicationModel();
    let query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    const applications = await Application.find(query);
    res.json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const Application = getApplicationModel();
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
       return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let app;
    if (global.useMongoose) {
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
      } else {
        app = await Application.findOneAndUpdate({ _id: req.params.id }, { status }, { new: true });
      }
    } else {
      app = await Application.findByIdAndUpdate(req.params.id, { status });
    }

    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: { ...app, status } });
  } catch (err) {
    next(err);
  }
};
