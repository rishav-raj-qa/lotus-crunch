const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDesc:   { type: String },
  price:       { type: Number, required: true },
  salePrice:   { type: Number },
  images:      [{ type: String }],
  category:    { type: String, required: true, enum: ['classic', 'flavoured', 'combo', 'gifting'] },
  flavour:     { type: String },
  weight:      { type: String },
  stock:       { type: Number, default: 0 },
  isFeatured:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  nutrition: {
    calories:  Number,
    protein:   Number,
    fat:       Number,
    carbs:     Number,
    fibre:     Number
  },
  benefits:    [String],
  ingredients: String,
  reviews:     [reviewSchema],
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 }
}, { timestamps: true });

productSchema.methods.calcRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.numReviews = 0; return; }
  this.rating    = this.reviews.reduce((a, r) => a + r.rating, 0) / this.reviews.length;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
