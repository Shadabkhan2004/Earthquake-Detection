import React, { useState } from "react";
import Home from "./components/Home"
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Predict from "./components/Predict"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/predict" element={<Predict/>}/>
      </Routes>
    </Router>
  );
}

export default App;
