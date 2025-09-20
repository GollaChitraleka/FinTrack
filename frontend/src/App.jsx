import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FinTrack from "./FinTrack";
export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        
        <Routes>
           <Route path="/" element={<FinTrack />} /> 
           <Route path="/login" element={<Login />} /> 
           <Route path="/signup" element={<Signup />} /> 
           </Routes>
        <footer>© {new Date().getFullYear()} FinTrack</footer>
      </div>
    </Router>
  );
}
