import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products/Products';
import ProductPage from './Products/ProductPage';


function App() {
  return (
   <Routes>
        {/* Render "Hi" on the home page */}
      <Route path="/" element={<h1>Hi</h1>} />
      <Route path="/Products" element={<Products />} />
       <Route path="/Products/:UID" element={<ProductPage />} />
      </Routes>
  );
}

export default App;