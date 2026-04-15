# 🪷 Lotus Crunch — Premium Makhana E-Commerce

A production-ready D2C e-commerce platform for a premium makhana brand.
Built with Next.js 14, Node.js/Express, MongoDB, Zustand, Tailwind CSS, and Razorpay.

---

## 📁 Project Structure

```
lotus-crunch/
├── frontend/               # Next.js 14 App Router
│   ├── app/
│   │   ├── page.js                     # Home page
│   │   ├── layout.js                   # Root layout (Navbar, Footer, Fonts)
│   │   ├── globals.css                 # Global styles + design tokens
│   │   ├── shop/page.js                # Shop page (filters, grid, pagination)
│   │   ├── product/[id]/page.js        # Product detail page
│   │   ├── cart/page.js                # Cart page
│   │   ├── checkout/page.js            # Checkout + Razorpay + COD
│   │   ├── order-success/page.js       # Order confirmation page
│   │   ├── about/page.js               # About / brand story
│   │   ├── auth/
│   │   │   ├── login/page.js           # Login
│   │   │   └── signup/page.js          # Sign up
│   │   └── admin/
│   │       ├── page.js                 # Admin dashboard
│   │       ├── products/page.js        # Product CRUD
│   │       └── orders/page.js          # Order management
│   ├── components/
│   │   ├── layout/  Navbar.js, Footer.js
│   │   ├── home/    Hero.js, ProblemSolution.js, FeaturedProducts.js,
│   │   │            Benefits.js, Testimonials.js, BottomCTA.js
│   │   └── shop/    ProductCard.js
│   ├── lib/api.js          # Axios instance + all API helpers
│   ├── store/index.js      # Zustand: CartStore + AuthStore (persisted)
│   └── hooks/useScrollAnimation.js
│
└── backend/                # Node.js + Express
    ├── server.js           # Entry point
    ├── seed.js             # Database seeder (6 products + admin user)
    ├── config/db.js        # MongoDB connection
    ├── models/
    │   ├── User.js         # User schema (bcrypt, addresses)
    │   ├── Product.js      # Product schema (nutrition, reviews, stock)
    │   └── Order.js        # Order schema (items, payment, status)
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── orderController.js
    │   └── paymentController.js  # Razorpay create + verify
    ├── routes/
    │   ├── auth.js, products.js, orders.js, payments.js
    │   ├── admin.js        # Stats, users list
    │   └── users.js        # Profile, addresses
    └── middleware/auth.js  # JWT protect + admin guard
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account (for payments)

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lotus-crunch
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Seed the database with sample products and an admin user:
```bash
node seed.js
# Output: Seeded 6 products
# Admin created: admin@lotuscrunch.in / Admin@123
```

Start the backend:
```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

Backend runs at: http://localhost:5000

---

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
```

**Important — Fix dynamic route folder name:**
```bash
# Rename the product page folder for Next.js dynamic routing:
mv app/product/id app/product/[id]
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 🔑 Default Admin Credentials

After running the seed script:
- **Email:** admin@lotuscrunch.in
- **Password:** Admin@123

Access admin panel at: http://localhost:3000/admin

---

## 💳 Payment Flow

### Razorpay
1. User fills checkout form → clicks "Pay ₹X"
2. Backend creates Razorpay order via `/api/payments/create-order`
3. Frontend opens Razorpay checkout modal
4. On success, frontend sends payment details to `/api/payments/verify`
5. Backend verifies HMAC signature → marks order as paid
6. User redirected to order success page

### Cash on Delivery
1. Order created directly with `paymentMethod: 'cod'`
2. Status stays `pending` until delivery
3. Admin marks as delivered via dashboard

---

## 🛣️ API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Get current user (protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (filter, sort, paginate) |
| GET | /api/products/:id | Single product by ID or slug |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Soft-delete (admin) |
| POST | /api/products/:id/review | Add review (auth) |

**Query params for GET /api/products:**
- `category` — classic | flavoured | combo | gifting
- `sort` — newest | price_asc | price_desc | rating
- `minPrice`, `maxPrice`
- `featured=true`
- `page`, `limit`

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders/my | My orders (auth) |
| GET | /api/orders/:id | Single order |
| GET | /api/orders | All orders (admin) |
| PUT | /api/orders/:id/status | Update status (admin) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payments/create-order | Create Razorpay order |
| POST | /api/payments/verify | Verify payment signature |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/users | All users |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| `cream` | `#FAF7F2` — primary background |
| `forest` | `#3D6B3D` — brand green (CTAs, accents) |
| `gold` | `#B8921F` — ratings, highlights |
| `ink` | `#1A1A1A` — primary text |
| Font (headings) | Fraunces (Google Fonts, serif) |
| Font (body/UI) | Syne (Google Fonts, geometric) |

---

## 🚀 Deployment

### Backend — Railway / Render / EC2

1. Push backend folder to a repo
2. Set environment variables in the platform dashboard
3. Set start command: `node server.js`
4. MongoDB: use MongoDB Atlas (free tier works)

```bash
# Update CORS in server.js for production URL:
origin: process.env.CLIENT_URL  # set to https://yourdomain.com
```

### Frontend — Vercel (recommended)

```bash
cd frontend
npx vercel --prod
```

Set in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

**Rename the dynamic route before deploying:**
```bash
mv app/product/id app/product/[id]
```

### Razorpay — Go Live
1. Complete KYC on Razorpay dashboard
2. Switch from `rzp_test_*` to `rzp_live_*` keys
3. Update `.env` and Vercel env vars

---

## ✅ Feature Checklist

- [x] Home page (Hero, Problem/Solution, Featured, Benefits, Testimonials, CTA)
- [x] Shop page (filters, sort, pagination)
- [x] Product detail page (gallery, nutrition, add to cart, related)
- [x] Cart (add, remove, update qty, subtotal, shipping logic)
- [x] Checkout (address form, Razorpay, COD)
- [x] Payment verification (HMAC signature)
- [x] Order success page
- [x] Auth (JWT login/signup)
- [x] Zustand cart + auth persistence (localStorage)
- [x] Admin dashboard (stats, recent orders)
- [x] Admin product CRUD
- [x] Admin order management (status updates)
- [x] About page (brand story, values)
- [x] Responsive (mobile-first Tailwind)
- [x] Scroll animations
- [x] Toast notifications
- [x] Skeleton loading states
- [x] Empty states
- [x] Free shipping logic (above ₹499)
- [x] Stock management (decrement on order)
- [x] Product reviews + ratings
- [x] DB seed script

---

## 🔧 Future Enhancements

- Cloudinary image upload for products
- Email notifications (Nodemailer / Resend)
- Coupon/discount code system
- Wishlist functionality
- Order tracking with SMS (MSG91)
- PWA support
- Google/Facebook OAuth
- Analytics dashboard (Chart.js)
