import React from 'react';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
   <Routes>
        {/* Render "Hi" on the home page */}
        <Route path="/" element={<h1>Hi</h1>} />
      </Routes>
  );
}

export default App;