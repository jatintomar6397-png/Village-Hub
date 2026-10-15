const getVillageModel = require('../models/Village');
const getComplaintModel = require('../models/Complaint');
const getApplicationModel = require('../models/Application');

exports.getStats = async (req, res, next) => {
  try {
    const Village = getVillageModel();
    const Complaint = getComplaintModel();
    const Application = getApplicationModel();

    const [
      totalVillages,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalApplications,
      pendingApplications,
      completedProjects,
      inProgressProjects
    ] = await Promise.all([
      Village.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Submitted' }), // Or include under review/in progress
      Complaint.countDocuments({ status: 'Resolved' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Pending' }),
      Village.countDocuments({ status: 'Completed' }),
      Village.countDocuments({ status: 'In Progress' })
    ]);

    res.json({
      success: true,
      data: {
        totalVillages,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalApplications,
        pendingApplications,
        completedProjects,
        inProgressProjects
      }
    });
  } catch (err) {
    next(err);
  }
};
