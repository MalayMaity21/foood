import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "../css/AdminLogin.css";

function AdminLogin({ theme }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/admin/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        console.log("Token received:", token); // Debugging
        localStorage.setItem("adminToken", token);
        login();
        alert("Login successful!");
        navigate("/admin-dashboard");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Login failed. Please check your credentials.");
      } else if (error.request) {
        alert("No response from the server. Please try again later.");
      } else {
        alert("An error occurred. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className={`admin-login-container ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
      <div className="admin-login-box">
        <h1 className="admin-login-title">Admin Login</h1>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group animate-slide-in">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group animate-slide-in">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-button animate-fade-in">
            Login
          </button>
        </form>
        <p className="admin-login-footer animate-fade-in">
          Forgot your password? <a href="/reset-password">Reset here</a>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;