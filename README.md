# Kalaa Rang

A modern, full-stack e-commerce platform built with React and Node.js, featuring a sleek dark theme UI and comprehensive admin management system for my small business.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)

## Overview

Kalaa Rang is a comprehensive e-commerce solution that provides both customer-facing shopping functionality and robust administrative tools. The platform features a modern black-themed UI with intuitive navigation, real-time inventory management,.

## Features

### Customer Features

- **Product Catalog**: Browse products with advanced filtering and search capabilities
- **Shopping Cart**: Add, remove, and manage items with real-time updates
- **User Authentication**: Secure registration, login, and profile management
- **Order Management**: Place orders, track status, and view order history
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Admin Features

- **Dashboard Analytics**: Sales metrics, customer insights, and order statistics
- **Product Management**: CRUD operations for products, categories, and inventory
- **Order Processing**: View, update, and manage customer orders
- **User Management**: Admin and customer account administration
- **Real-time Updates**: Live inventory tracking and order status updates

### Technical Features

- **Dark Theme UI**: Professional black and white design with subtle accents
- **State Management**: Redux Toolkit (RTK) for predictable state management
- **API Integration**: RTK Query for efficient data fetching and caching
- **Real-time Updates**: Automatic UI updates on data changes
- **Form Validation**: Client-side validation with error handling
- **Image Upload**: Multer integration for product image management

## Technology Stack

### Frontend

- **React 18.3.1**: Modern React with hooks and functional components
- **Redux Toolkit (RTK) 2.8.2**: State management with RTK Query for API calls
- **React Redux 9.2.0**: React bindings for Redux state management
- **React Router DOM 7.8.2**: Client-side routing and navigation
- **Tailwind CSS 4.1.12**: Utility-first CSS framework for styling
- **Vite 7.1.2**: Fast build tool and development server
- **React Icons 5.5.0**: Comprehensive icon library
- **Axios 1.11.0**: HTTP client for API requests
- **React Toastify 11.0.5**: Toast notifications for user feedback

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js 5.1.0**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Mongoose 8.18.0**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs 3.0.2**: Password hashing and security
- **Multer 2.0.2**: File upload handling

### Additional Libraries

- **React ApexCharts 1.7.0**: Interactive charts for admin dashboard
- **Moment.js 2.30.1**: Date and time manipulation
- **React Slick 0.31.0**: Carousel and slider components

## Project Structure

```
kalaa-rang/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── categoryController.js # Category CRUD operations
│   │   ├── orderController.js    # Order management logic
│   │   ├── productController.js  # Product CRUD operations
│   │   └── userController.js     # User authentication & management
│   ├── middleware/
│   │   ├── asyncHandler.js       # Async error handling
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── checkId.js           # MongoDB ID validation
│   ├── models/
│   │   ├── categoryModel.js      # Category schema
│   │   ├── orderModel.js         # Order schema
│   │   ├── productModel.js       # Product schema
│   │   └── userModel.js          # User schema
│   ├── routes/
│   │   ├── categoryRoutes.js     # Category API routes
│   │   ├── orderRoutes.js        # Order API routes
│   │   ├── productRoutes.js      # Product API routes
│   │   └── userRoutes.js         # User API routes
│   └── index.js                  # Server entry point
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Admin/           # Admin dashboard pages
│   │   │   ├── Auth/            # Authentication pages
│   │   │   └── Shop/            # Customer-facing pages
│   │   ├── redux/
│   │   │   ├── api/             # RTK Query API slices
│   │   │   ├── features/        # Redux feature slices
│   │   │   ├── constants.js     # API endpoints and constants
│   │   │   └── store.js         # Redux store configuration
│   │   └── main.jsx             # React application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env                          # Environment variables
├── package.json                  # Root package configuration
└── README.md
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/sourabhaprasad/kalaa-rang.git
   cd kalaa-rang
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Database Setup**

   - Ensure MongoDB is running locally or configure MongoDB Atlas
   - The application will automatically create necessary collections

5. **Start the application**

   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev

   # Or run separately:
   # Backend only
   npm run backend

   # Frontend only (in another terminal)
   npm run frontend
   ```

## Configuration

### Environment Variables

| Variable     | Description               | Required |
| ------------ | ------------------------- | -------- |
| `NODE_ENV`   | Application environment   | Yes      |
| `PORT`       | Backend server port       | Yes      |
| `MONGO_URI`  | MongoDB connection string | Yes      |
| `JWT_SECRET` | Secret key for JWT tokens | Yes      |

### Redux Store Configuration

The application uses Redux Toolkit for state management with the following structure:

```javascript
// store.js - RTK store configuration
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSliceReducer from "./features/auth/authSlice";
import favoritesSliceReducer from "./features/favorites/favoritesSlice";
import cartSliceReducer from "./features/cart/cartSlice";
import shopSliceReducer from "./features/shop/shopSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    favorites: favoritesSliceReducer,
    cart: cartSliceReducer,
    shop: shopSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
```

### RTK Query API Integration

The application leverages RTK Query for efficient API state management:

```javascript
// apiSlice.js - Base API configuration
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: (builder) => ({}),
});
```

## Usage

### Customer Workflow

1. **Registration/Login**: Create account or sign in
2. **Browse Products**: Explore product catalog with filters
3. **Add to Cart**: Select products and manage cart
4. **Order Tracking**: Monitor order status and history

### Admin Workflow

1. **Admin Login**: Access admin panel with elevated privileges
2. **Dashboard**: View sales analytics and platform metrics
3. **Product Management**: Add, edit, or remove products
4. **Order Management**: Process and update order statuses
5. **User Management**: Manage customer accounts and permissions

### Key Redux Patterns

**RTK Query Data Fetching:**

```javascript
// Using RTK Query hooks for data fetching
const { data: products, isLoading, error } = useGetProductsQuery();
const [createProduct] = useCreateProductMutation();
```

**State Management with RTK:**

```javascript
// Redux slice for cart management
const cartSlice = createSlice({
  name: "cart",
  initialState: { cartItems: [] },
  reducers: {
    addToCart: (state, action) => {
      // RTK uses Immer for immutable updates
      state.cartItems.push(action.payload);
    },
  },
});
```

## API Documentation

### Authentication Endpoints

- `POST /api/users/auth` - User login
- `POST /api/users/register` - User registration
- `POST /api/users/logout` - User logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Endpoints

- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/pay` - Update order payment status
- `PUT /api/orders/:id/deliver` - Mark order as delivered (Admin)

### Category Endpoints

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)
