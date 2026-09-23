# ShopSphere — Full-Stack E-commerce Internship Project

A polished e-commerce demonstration built with React, Node.js, Express and MongoDB.

## Features

- Responsive modern storefront
- Product catalog with search, category filter and sorting
- Product detail pages
- Recommended products by category/rating
- User registration and login
- JWT authentication
- Password hashing with bcrypt
- MongoDB-backed cart
- Quantity updates and stock checks
- Simulated checkout (Cash on Delivery)
- Automatic stock deduction when an order is placed
- Order history
- Admin seed account
- REST API

## Project structure

```text
shopsphere/
  backend/
    src/
      middleware/
      models/
      routes/
      utils/seed.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
      context/
      pages/
      api.js
      App.jsx
      main.jsx
      styles.css
    package.json
    index.html
```

## 1. Start MongoDB

Use either a local MongoDB server or MongoDB Atlas.

## 2. Backend setup

```bash
cd backend
npm install
```

Create a file named `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopsphere
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Then seed demo products:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

## 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Demo admin account

Email: `admin@shopsphere.com`
Password: `Admin@123`

The current UI is intentionally focused on the customer shopping experience. The backend already contains protected admin product-create/update routes so an admin dashboard can be added later without changing the core architecture.

## API overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/categories`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)

### Cart
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`

### Orders
- `POST /api/orders`
- `GET /api/orders/my`

## Demonstration flow

1. Open the home page and show the responsive UI.
2. Search for `keyboard` from the navbar.
3. Open the Nova Mechanical Keyboard product.
4. Show the rating, discount, stock and product recommendation section.
5. Login/register.
6. Add the product to the cart and change quantity.
7. Open checkout and submit a simulated COD order.
8. Show automatic stock deduction and the order confirmation.
9. Open Orders and demonstrate persisted order history.

This gives a clean story for the internship: frontend → API integration → authentication → database → cart → checkout → orders.
