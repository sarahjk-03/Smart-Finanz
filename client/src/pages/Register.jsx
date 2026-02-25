import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/"); // go back to login
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
  <div className="register-card">
    <h2>Register</h2>

    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="register-input"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="register-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
      />

      <button type="submit" className="register-button">
        Register
      </button>
    </form>

    <p className="register-login">
      Already have an account?{" "}
      <span onClick={() => navigate("/")}>Login</span>
    </p>
  </div>
</div>
  )};
export default Register;

