const Order   = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, guestEmail } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items' });

    let subtotal = 0;
    const enriched = [];
    for (const item of items) {
      const p = await Product.findById(item.product);
      if (!p) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (p.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
      subtotal += (p.salePrice || p.price) * item.quantity;
      enriched.push({ product: p._id, name: p.name, image: p.images[0], price: p.salePrice || p.price, quantity: item.quantity });
    }

    const shippingCost = subtotal >= 499 ? 0 : 49;
    const total = subtotal + shippingCost;

    const order = await Order.create({
      user: req.user?._id,
      guestEmail,
      items: enriched,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      paymentMethod
    });

    // Decrement stock
    for (const item of enriched) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.user?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};
    const total  = await Order.countDocuments(query);
    const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
