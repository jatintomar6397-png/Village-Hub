const getVillageModel = require('../models/Village');

exports.getVillages = async (req, res, next) => {
  try {
    const Village = getVillageModel();
    const { district, search, status } = req.query;
    let query = {};
    if (district) query.district = district;
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const villages = await Village.find(query);
    res.json({ success: true, data: villages });
  } catch (err) {
    next(err);
  }
};

exports.getVillageById = async (req, res, next) => {
  try {
    const Village = getVillageModel();
    const village = await Village.findById(req.params.id);
    if (!village) return res.status(404).json({ success: false, message: 'Village not found' });
    res.json({ success: true, data: village });
  } catch (err) {
    next(err);
  }
};

exports.createVillage = async (req, res, next) => {
  try {
    const Village = getVillageModel();
    const newVillage = await Village.create(req.body);
    res.status(201).json({ success: true, data: newVillage });
  } catch (err) {
    next(err);
  }
};

exports.updateVillage = async (req, res, next) => {
  try {
    const Village = getVillageModel();
    const village = await Village.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!village) return res.status(404).json({ success: false, message: 'Village not found' });
    res.json({ success: true, data: village });
  } catch (err) {
    next(err);
  }
};

exports.deleteVillage = async (req, res, next) => {
  try {
    const Village = getVillageModel();
    const village = await Village.findByIdAndDelete(req.params.id);
    if (!village) return res.status(404).json({ success: false, message: 'Village not found' });
    res.json({ success: true, message: 'Village deleted successfully' });
  } catch (err) {
    next(err);
  }
};
