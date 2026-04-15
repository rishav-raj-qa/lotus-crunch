const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User    = require('./models/User');

const products = [
  {
    name: 'Classic Himalayan Salt',
    slug: 'classic-himalayan-salt',
    description: 'Carefully sourced and roasted to perfection, Lotus Crunch makhana delivers a guilt-free snacking experience packed with nutrition. Lightly seasoned with pure Himalayan pink salt for a clean, satisfying crunch.',
    shortDesc: 'Light, airy, and perfectly salted. Our bestseller.',
    price: 249,
    salePrice: 199,
    images: ['/images/himalayan-salt.jpg'],
    category: 'classic',
    flavour: 'Himalayan Salt',
    weight: '70g',
    stock: 150,
    isFeatured: true,
    nutrition: { calories: 347, protein: 9.7, fat: 0.1, carbs: 76.9, fibre: 14.5 },
    benefits: ['High in protein', 'Low in fat', 'Gluten-free', 'No preservatives', 'Antioxidant-rich'],
    ingredients: 'Fox nuts (makhana), Himalayan pink salt, cold-pressed coconut oil'
  },
  {
    name: 'Peri Peri Punch',
    slug: 'peri-peri-punch',
    description: 'For those who crave a little heat. Our Peri Peri makhana packs the perfect spicy kick balanced with tangy herbs — impossible to eat just one handful.',
    shortDesc: 'Spicy, tangy, absolutely addictive.',
    price: 279,
    salePrice: 229,
    images: ['/images/peri-peri.jpg'],
    category: 'flavoured',
    flavour: 'Peri Peri',
    weight: '70g',
    stock: 120,
    isFeatured: true,
    nutrition: { calories: 355, protein: 9.5, fat: 1.2, carbs: 74.8, fibre: 14.2 },
    benefits: ['High in protein', 'Low in fat', 'Gluten-free', 'Real spice blend'],
    ingredients: 'Fox nuts (makhana), peri peri seasoning, cold-pressed sunflower oil, salt'
  },
  {
    name: 'Cream & Herbs',
    slug: 'cream-and-herbs',
    description: 'A sophisticated blend of cream and aromatic herbs. Indulgently flavoured yet surprisingly light, this is the snack that impresses at every gathering.',
    shortDesc: 'Creamy, herbaceous, and surprisingly light.',
    price: 279,
    images: ['/images/cream-herbs.jpg'],
    category: 'flavoured',
    flavour: 'Cream & Herbs',
    weight: '70g',
    stock: 100,
    isFeatured: true,
    nutrition: { calories: 362, protein: 9.3, fat: 1.8, carbs: 73.5, fibre: 13.9 },
    benefits: ['High in protein', 'Low in fat', 'Gluten-free', 'No MSG'],
    ingredients: 'Fox nuts (makhana), cream powder, mixed herbs, cold-pressed sunflower oil, salt'
  },
  {
    name: 'Dark Chocolate Bliss',
    slug: 'dark-chocolate-bliss',
    description: 'The indulgent option that does not compromise on health. Premium 70% dark chocolate coating on perfectly roasted makhana — the ideal post-workout treat.',
    shortDesc: 'Premium dark chocolate meets protein-rich makhana.',
    price: 349,
    salePrice: 299,
    images: ['/images/dark-chocolate.jpg'],
    category: 'flavoured',
    flavour: 'Dark Chocolate',
    weight: '60g',
    stock: 80,
    isFeatured: false,
    nutrition: { calories: 420, protein: 8.8, fat: 6.2, carbs: 78.1, fibre: 13.2 },
    benefits: ['Antioxidant-rich', 'Post-workout snack', 'Dark chocolate goodness'],
    ingredients: 'Fox nuts (makhana), dark chocolate (70% cocoa), cocoa butter, coconut sugar'
  },
  {
    name: 'Starter Pack — Try All 3',
    slug: 'starter-pack-try-all-3',
    description: 'New to Lotus Crunch? Start with our most popular trio. Three 70g packs of Himalayan Salt, Peri Peri, and Cream & Herbs — the perfect introduction to guilt-free snacking.',
    shortDesc: 'The perfect introduction. Three bestselling flavours.',
    price: 699,
    salePrice: 549,
    images: ['/images/starter-pack.jpg'],
    category: 'combo',
    weight: '3 × 70g',
    stock: 60,
    isFeatured: true,
    nutrition: { calories: 350, protein: 9.5, fat: 1.0, carbs: 75.0, fibre: 14.2 },
    benefits: ['Save ₹78', 'Try 3 flavours', 'Perfect gifting option'],
    ingredients: 'Contains 3 packs: Himalayan Salt, Peri Peri, Cream & Herbs'
  },
  {
    name: 'Premium Gift Box',
    slug: 'premium-gift-box',
    description: 'A beautifully curated gift box with 5 assorted flavours of Lotus Crunch makhana. Handcrafted packaging made from recycled materials, perfect for every occasion.',
    shortDesc: 'Handcrafted. Beautifully curated. Perfect gifting.',
    price: 999,
    salePrice: 849,
    images: ['/images/gift-box.jpg'],
    category: 'gifting',
    weight: '5 × 70g',
    stock: 40,
    isFeatured: false,
    nutrition: { calories: 350, protein: 9.5, fat: 1.0, carbs: 75.0, fibre: 14.2 },
    benefits: ['5 premium flavours', 'Eco-friendly packaging', 'Handcrafted box', 'Free message card'],
    ingredients: 'Assorted: Himalayan Salt, Peri Peri, Cream & Herbs, Dark Chocolate, Cheddar Cheese'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lotus-crunch');
  await Product.deleteMany({});
  await Product.insertMany(products);
  // Create admin
  const adminExists = await User.findOne({ email: 'admin@lotuscrunch.in' });
  if (!adminExists) {
    await User.create({ name: 'Admin', email: 'admin@lotuscrunch.in', password: 'Admin@123', role: 'admin' });
    console.log('Admin created: admin@lotuscrunch.in / Admin@123');
  }
  console.log(`Seeded ${products.length} products`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
