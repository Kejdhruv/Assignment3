import React from "react";
import {  useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();
     const handleLogout = () => {
    fetch("http://localhost:8000/Auth/Logout", {
      method: "GET",
      credentials: "include",
    })
      .then(() => navigate("/"))
      .catch((err) => console.error("Logout failed", err));
  };

  return (
    <nav className="home-navbar">
      <ul className="home-nav-links">
        <li><Link to="/Products">Products</Link></li>
        <li><Link to="/Profile">Profile</Link></li>
        <li><Link to="/Cart">Cart</Link></li>
        <li onClick={handleLogout} ><Link  >Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;