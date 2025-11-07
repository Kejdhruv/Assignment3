import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="home-navbar">
      <ul className="home-nav-links">
        <li><Link to="/Products">Products</Link></li>
        <li><Link to="/Profile">Profile</Link></li>
        <li><Link to="/Cart">Cart</Link></li>
        <li><Link to="/">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;