const Razorpay = require('razorpay');
const crypto   = require('crypto');
const Order    = require('../models/Order');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const rzpOrder = await razorpay.orders.create({
      amount:   Math.round(order.total * 100),
      currency: 'INR',
      receipt:  `receipt_${order._id}`
    });

    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.json({ razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const body      = razorpayOrderId + '|' + razorpayPaymentId;
    const expected  = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expected !== razorpaySignature) return res.status(400).json({ message: 'Payment verification failed' });

    const order = await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus: 'paid',
      orderStatus:   'confirmed'
    }, { new: true });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
