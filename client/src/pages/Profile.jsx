import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      setMessage("Please enter a new password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated successfully ✅");
        setNewPassword("");
      } else {
        setMessage(data.message);
      }

    } catch (err) {
      setMessage("Server error");
    }
  };

return (
  <div className="profile-wrapper">
    <div className="profile-card">
      <h2>Profile</h2>

      <h3>Change Password</h3>

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={handleUpdatePassword}>
        Update Password
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  </div>
)};

export default Profile;