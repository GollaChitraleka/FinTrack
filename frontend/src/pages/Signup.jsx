import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Signup() {
  const [username, setUsername] = useState(""); // changed from name → username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send username, email, password (matching backend)
      await axios.post(`${API}/api/auth/signup`, { username, email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data); // better debugging
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} className="link">
          Login
        </span>
      </p>
    </div>
  );
}
