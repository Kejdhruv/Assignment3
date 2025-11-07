# Assignment3
A full-stack **E-commerce application** built with **MongoDB, Express.js, React.js, Node.js (MERN)** and **JWT-based authentication**.  
Users can browse products, manage their cart, place orders, and view profile information in a responsive and aesthetic dashboard.

---

## Features

- **User Authentication:** Sign up and login using JWT tokens for secure authentication.  
- **Profile Management:** View user information and past orders.  
- **Product Management:** Browse products, view details, and interact with the cart.  
- **Cart Functionality:** Add, remove, update, and fetch items in the cart.  
- **Order Management:** Place orders and fetch order history.  
- **Responsive UI:** Modern layout with Navbar, Profile, Products, Cart, and Order pages.  
- **Notifications:** Toast notifications for success/error messages.

---

## Tech Stack

- **Frontend:** React.js, CSS, React Router, React Toastify, Vite  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT Tokens  
- **Folder Structure:** Modular organization for Authentication, Products, User, Cart, and Orders

---

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/Assignment3.git
cd mern-ecommerce


2. Install backend dependencies: 

cd Backend
npm install
npm install express
npm install cors
npm install mongoose
npm install bycryptjs
npm install jsonwebtoken


3. Install Frontend Dependencies

cd ../frontend
npm install
npm install react-router-dom
npm install react-sliders

4. Start backend server: 

cd ../Backend
npm start

5. Start frontend development server:

cd ../frontend
npm run dev


Project STRUCTURE: 

Backend/
├─ Middleware/
│  └─ DecodeToken.js
├─ Products/
│  ├─ Fetch.js
│  └─ FetchProduct.js
├─ User/
│  ├─ Authentication/
│  │  ├─ CreateUser.js
│  │  └─ GetUser.js
├─ Cart/
│  ├─ Cart.js
│  ├─ DeleteCart.js
│  ├─ FetchCart.js
│  └─ UpdateCart.js
├─ Order/
│  ├─ FetchingOrder.js
│  └─ PostingOrder.js
├─ index.js
├─ package.json
└─ package-lock.json

frontend/
├─ public/
├─ src/
│  ├─ Authentication/
│  │  ├─ Auth.css
│  │  ├─ Auth.jsx
│  │  ├─ Login.css
│  │  ├─ Login.jsx
│  │  ├─ SignUp.css
│  │  └─ SignUp.jsx
│  ├─ Layout/
│  │  ├─ Layout.jsx
│  │  ├─ Navbar.css
│  │  └─ Navbar.jsx
│  ├─ Products/
│  │  ├─ ProductPage.css
│  │  ├─ ProductPage.jsx
│  │  ├─ Products.css
│  │  └─ Products.jsx
│  ├─ User/
│  │  ├─ Cart/
│  │  │  ├─ Cart.css
│  │  │  └─ Cart.jsx
│  │  └─ Profile/
│  │     ├─ Profile.css
│  │     └─ Profile.jsx
│  ├─ assets/
│  │  └─ react.svg
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ package.json
└─ package-lock.json

.gitignore
README.md
vite.config.js
index.html
eslint.config.js

## API Endpoints

| Method | Endpoint               | Auth Required | Description                                |
|--------|------------------------|---------------|--------------------------------------------|
| GET    | `/Products`            | No            | Fetch all products                          |
| GET    | `/Products/:UID`       | No            | Fetch single product by UID                 |
| POST   | `/Cart`                | Yes           | Add items to cart                           |
| GET    | `/Cart`                | Yes           | Fetch user’s cart                           |
| PUT    | `/Cart/:cartItemID`    | No            | Update quantity of a specific cart item    |
| DELETE | `/Cart/:cartItemID`    | No            | Delete a specific cart item                 |
| POST   | `/Order`               | Yes           | Place an order                              |
| GET    | `/Order`               | Yes           | Fetch all orders for the logged-in user    |
| POST   | `/Auth/Signup`         | No            | Register a new user                          |
| POST   | `/Auth/Login`          | No            | Login user and receive JWT cookie           |
| GET    | `/Auth/Logout`         | No            | Logout user and clear JWT cookie            |


---
MIT LICENSE
If you want, I can also **add a “Screenshots & UI Preview” section** and **JWT usage examples in headers** to make this README **super professional for GitHub**.  

Do you want me to do that?