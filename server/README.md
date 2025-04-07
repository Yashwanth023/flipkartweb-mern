
# FlipKart Clone Backend

## Overview

This is the backend service for the FlipKart Clone e-commerce platform. It provides APIs for product management, user authentication, order processing, and other core e-commerce functionalities.

## Features

- **Product Management**: CRUD operations for products and categories
- **User Authentication**: Secure user registration and login
- **Order Processing**: Order creation, payment processing, and order status management
- **Search Functionality**: Advanced product search and filtering
- **Coupon Management**: Create and validate discount coupons

## Technologies Used

- **Node.js**: Backend runtime environment
- **Express**: Web framework for building APIs
- **TypeScript**: For type-safe code
- **Database**: Data storage and management
- **JWT**: For secure authentication

## Getting Started

To run the backend server locally:

```sh
# Navigate to the server directory
cd flipkart-clone/server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configurations

# Start the development server
npm run dev
```

## API Endpoints

The backend provides the following main API endpoints:

- **Products**: `/api/products`
- **Users**: `/api/users`
- **Authentication**: `/api/auth`
- **Orders**: `/api/orders`
- **Categories**: `/api/categories`
- **Coupons**: `/api/coupons`

Refer to the API documentation for detailed information on each endpoint and their usage.

## Environment Variables

See `.env.example` for the required environment variables.
