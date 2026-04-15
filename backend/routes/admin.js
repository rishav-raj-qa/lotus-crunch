const router = require('express').Router();
const { protect, admin } = require('../middleware/auth');
const User    = require('../models/User');
const Order   = require('../models/Order');
const Product = require('../models/Product');

router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueData] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }])
    ]);
    res.json({ totalOrders, totalUsers, totalProducts, totalRevenue: revenueData[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
