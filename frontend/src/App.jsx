import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products/Products';
import ProductPage from './Products/ProductPage';
import Cart from './User/Cart/Cart';
import Auth from './Authentication/Auth';


function App() {
  return (
   <Routes>
        {/* Render "Hi" on the home page */}
      <Route path="/Products" element={<Products />} />
      <Route path="/Cart" element={<Cart />} /> 
        <Route path="/" element={<Auth/>} /> 
       <Route path="/Products/:UID" element={<ProductPage />} />
      </Routes>
  );
}

export default App;