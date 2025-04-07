
# FlipKart Clone E-Commerce Project

A full-stack e-commerce application inspired by FlipKart, providing a comprehensive shopping experience with modern UI and robust backend functionality.

## Project Structure

The project is organized into two main parts:

- **client**: Frontend React application
- **server**: Backend API service

## Getting Started

### Frontend Setup

```sh
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Backend Setup

```sh
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configurations

# Start the development server
npm run dev
```

## Features

- **Product Browsing**: Browse products by categories including Electronics, Fashion, Home & Kitchen, Beauty, and Sports & Fitness
- **Product Details**: View detailed information about products including price, description, and stock availability
- **Shopping Cart**: Add products to cart, update quantities, and proceed to checkout
- **Dark/Light Theme**: Toggle between light and dark modes for comfortable viewing
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Search Functionality**: Search for products across all categories
- **User Authentication**: Register and login functionality
- **Order Management**: View past orders and track order status
- **Admin Dashboard**: Manage products, orders, and user accounts

## Technologies Used

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Tanstack Query for data fetching
- Shadcn UI components

### Backend
- Node.js and Express
- RESTful API architecture
- JWT authentication
- Database for data persistence

## Deployment

See the individual README files in the client and server directories for specific deployment instructions.
