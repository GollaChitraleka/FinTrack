import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      
      // store token in localStorage
      localStorage.setItem("token", res.data.token);

      // optional: store user info if needed
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/"); // redirect to dashboard/home
    } catch (err) {
      console.error(err.response?.data); // better debugging
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")} className="link">
          Sign up
        </span>
      </p>
    </div>
  );
}
