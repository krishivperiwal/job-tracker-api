const Application = require("../models/Application");

const getAnalytics = async (req, res, next) => {
  try {

    const userId = req.user.userId;

    const stats = await Application.aggregate([
      {
        $match: { userId: new require("mongoose").Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const analytics = {
      totalApplications: 0,
      interviews: 0,
      offers: 0,
      rejected: 0,
      ghosted: 0
    };

    stats.forEach(item => {

      analytics.totalApplications += item.count;

      if (item._id === "Interview") analytics.interviews = item.count;
      if (item._id === "Offer") analytics.offers = item.count;
      if (item._id === "Rejected") analytics.rejected = item.count;
      if (item._id === "Ghosted") analytics.ghosted = item.count;

    });

    res.json(analytics);

  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };