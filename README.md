# EatBuddy-Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

## Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Author](#author)

---

## About The Project

This repository hosts the backend for the **EatBuddy** platform, a comprehensive food ordering and delivery system. This service is built to power two distinct frontend applications: a Vendor Dashboard for managing firms and food items, and a customer-facing Food App for Browse and ordering.

The backend provides all the necessary APIs for user authentication (both vendors and future customer accounts), managing vendor profiles, firm details, and product listings, with secure data handling and robust architecture.

## Features

* **Vendor Authentication:** Secure registration and login for vendors using JWT.
* **Firm Management:** Vendors can add and delete their firm/restaurant details.
* **Product Management:** Vendors can add, view, and delete food products associated with their firm.
* **Relationship Management:** Establishes relationships between Vendors, Firms, and Products (one-to-many, one-to-one).
* **Image Uploads:** Supports image uploads for firms and products using Multer.
* **Secure API Endpoints:** Protected routes using JWT verification middleware.

## Tech Stack

The EatBuddy Backend is built using the MERN stack's backend components:

* **Node.js:** JavaScript runtime environment for server-side logic.
* **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** NoSQL document database for flexible data storage.
* **Mongoose:** MongoDB object data modeling (ODM) for Node.js, simplifying interactions with MongoDB.
* **dotenv:** For loading environment variables from a `.env` file.
* **body-parser:** Middleware to parse incoming request bodies.
* **nodemon:** Development tool for automatically restarting the Node.js server on file changes.
* **jsonwebtoken (JWT):** For generating and verifying JSON Web Tokens for secure authentication.
* **bcryptjs:** For hashing passwords to securely store them in the database.
* **multer:** Middleware for handling `multipart/form-data`, primarily used for file uploads (images).
* **cors:** Node.js middleware for providing a Connect/Express middleware that can be used to enable CORS with various options.

## Architecture

The backend follows a standard MVC-like architecture pattern to ensure separation of concerns, maintainability, and scalability:

* **Models:** Define the structure and relationships of data stored in MongoDB using Mongoose schemas (e.g., `Vendor`, `Firm`, `Product`).
* **Controllers:** Contain the business logic and handle incoming requests, interacting with models to perform CRUD operations and prepare responses.
* **Routes:** Define the API endpoints and map them to specific controller functions.
* **Middleware:** Functions executed before the route handlers, used for authentication (`verifyToken`), logging, or parsing request bodies.

## Database Schema

The core entities and their relationships are as follows:

* **Vendor Model:**
    * `username` (String, unique)
    * `email` (String, unique)
    * `password` (String, hashed)
    * `firm` (Relationship: One-to-one with `Firm` model - a vendor owns one firm)

* **Firm Model:**
    * `firmName` (String, unique)
    * `area` (String)
    * `category` (String - e.g., Indian, Italian, Fast Food)
    * `region` (String - e.g., North, South)
    * `offer` (Boolean - indicates if firm has offers)
    * `image` (String - path to firm's image)
    * `vendor` (Relationship: One-to-one with `Vendor` model - the vendor who owns this firm)
    * `products` (Relationship: One-to-many with `Product` model - a firm has many products)

* **Product Model:**
    * `productName` (String)
    * `price` (Number)
    * `category` (String - e.g., Pizza, Burger, Dessert)
    * `image` (String - path to product's image)
    * `bestSeller` (Boolean)
    * `description` (String)
    * `firm` (Relationship: One-to-one with `Firm` model - the firm this product belongs to)

## API Endpoints

The following APIs are available. Routes marked with **(Auth Required)** need a valid JWT in the `Authorization: Bearer <token>` header.

**Base URL for deployed APIs:** `https://eatbuddy-backend-vendordashboard.onrender.com`

---

### **Vendor Routes (`/vendor`)**

* **Vendor Register**
    * `POST /vendor/register`
    * **Description:** Registers a new vendor account.
    * **Body:** `{ username, email, password }`
* **Vendor Login**
    * `POST /vendor/login`
    * **Description:** Logs in a vendor and returns a JWT.
    * **Body:** `{ email, password }`
* **Get All Vendor Details with Relations**
    * `GET /vendor/all-vendors`
    * **Description:** Retrieves details of all vendors, including their associated firm and products.
    * **Auth Required:** Yes (for client-side consumption, likely restricted to authenticated users)
* **Get Single Vendor Details**
    * `GET /vendor/single-vendor/:id`
    * **Description:** Retrieves details of a specific vendor by ID, including their associated firm and products.
    * **Auth Required:** Yes
    * **Example:** `https://eatbuddy-backend-vendordashboard.onrender.com/vendor/single-vendor/65f09694afec305a5a2905da`

---

### **Firm Routes (`/firm`)**

* **Add Firm to Vendor**
    * `POST /firm/add-firm`
    * **Description:** Adds a new firm and associates it with the authenticated vendor.
    * **Auth Required:** Yes
    * **Body:** `{ firmName, area, category, region, offer, [image - via multipart/form-data] }`
* **Delete Firm by ID**
    * `DELETE /firm/:firmId`
    * **Description:** Deletes a specific firm by its ID.
    * **Auth Required:** Yes (and typically, only the owning vendor should be able to delete)
    * **Example:** `https://eatbuddy-backend-vendordashboard.onrender.com/firm/65f09694afec305a5a2905db` (replace `firmId`)
* **Image Uploads (via Firm/Product routes)**
    * `POST /firm/uploads/:imageName`
    * **Description:** Endpoint for serving static images (often not a direct upload endpoint but for serving). Note: Actual image upload likely happens within `add-firm` or `add-product` routes using `multer`.
    * **Example:** `https://eatbuddy-backend-vendordashboard.onrender.com/firm/uploads/my-firm-logo.png`

---

### **Product Routes (`/product`)**

* **Add Product to Firm**
    * `POST /product/add-product/:firmId`
    * **Description:** Adds a new product and associates it with the specified firm.
    * **Auth Required:** Yes (and typically, only the owning vendor should be able to add products to their firm)
    * **Example:** `https://eatbuddy-backend-vendordashboard.onrender.com/product/add-product/65f09694afec305a5a2905db` (replace `firmId`)
    * **Body:** `{ productName, price, category, bestSeller, description, [image - via multipart/form-data] }`
* **Get Products by Firm ID**
    * `GET /product/:firmId/products`
    * **Description:** Retrieves all products belonging to a specific firm.
    * **Auth Required:** No (typically public for customers to browse)
    * **Example:** `https://eatbuddy-backend-vendordashboard.onrender.com/product/65f09694afec305a5a2905db/products` (replace `firmId`)
* **Delete Product by ID**
    * `DELETE /product/:productId`
    * **Description:** Deletes a specific product by its ID.
    * **Auth Required:** Yes (and typically, only the owning vendor should be able to delete their products)
    * **Example:** `https://eatbuddy-backend-vendordashboard.onrender.com/product/65f09694afec305a5a2905dc` (replace `productId`)

---

## Getting Started

Follow these steps to set up and run the EatBuddy Backend locally for development.

### Prerequisites

* Node.js (LTS version recommended)
* npm (Node Package Manager) or Yarn
* MongoDB (local instance or cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ArunKumarValmiki/EatBuddy-Backend.git](https://github.com/ArunKumarValmiki/EatBuddy-Backend.git)
    cd EatBuddy-Backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create a `.env` file:**
    In the root of the project, create a file named `.env` and add the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000 # Or any port you prefer
    ```
    *Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., `mongodb://localhost:27017/eatbuddy` for local, or your Atlas connection string).*
    *Replace `your_jwt_secret_key` with a long, strong, random string.*

### Running the Application

To start the development server:
```bash
npm start
# or
yarn start
```
---
## Deployment

**The EatBuddy Backend is currently deployed and hosted on Render.com**

```bash
https://eatbuddy-backend-vendordashboard.onrender.com
```
---

## Author

### Arun Kumar Valmiki
