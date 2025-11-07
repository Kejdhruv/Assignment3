import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products/Products';
import ProductPage from './Products/ProductPage';
import Cart from './User/Cart/Cart';
import Auth from './Authentication/Auth';
import Profile from './User/Profile/Profile';
import Layout from './Layout/Layout';


function App() {
  return (
   <Routes>
        {/* Render "Hi" on the home page */}
      <Route path="/" element={<Auth />} /> 
      
  <Route element={<Layout />}>
         <Route path="/Products" element={<Products />} />
         <Route path="/Cart" element={<Cart />} /> 
         <Route path="/Products/:UID" element={<ProductPage />} />
         <Route path="/Profile" element={<Profile />} /> 
  </Route> 
      </Routes>
  );
}

export default App;