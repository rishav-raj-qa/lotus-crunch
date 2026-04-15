const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      String,
  image:     String,
  price:     Number,
  quantity:  { type: Number, required: true, default: 1 }
});

const orderSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail:    String,
  items:         [orderItemSchema],
  shippingAddress: {
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    line1:   { type: String, required: true },
    line2:   String,
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true }
  },
  subtotal:      { type: Number, required: true },
  shippingCost:  { type: Number, default: 0 },
  discount:      { type: Number, default: 0 },
  total:         { type: Number, required: true },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId:   String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  orderStatus:   { type: String, enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  deliveredAt:   Date
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
