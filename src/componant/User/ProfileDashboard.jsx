import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "../css/ProfileDashboard.css";

function ProfileDashboard({ theme }) {
  const { userName } = useParams(); // Extract userName from the URL
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Access user from UserContext
  const [profileData, setProfileData] = useState({
    userName: "",
    email: "",
    mobNum: "",
    address: "",
    dob: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = user?.id; // Assuming user ID is available in context
      if (!userId) {
        console.error("User ID is undefined. Redirecting to login.");
        navigate("/user-login");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing. Redirecting to login.");
        navigate("/user-login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/users/profile/id/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData({
            userName: data.userName || "N/A",
            email: data.email || "N/A",
            mobNum: data.mobNum || "N/A",
            address: data.address || "N/A",
            dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "N/A",
          });
        } else if (response.status === 401) {
          console.error("Unauthorized. Redirecting to login.");
          navigate("/user-login");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch profile data.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("An error occurred. Please try again.");
      }
    };

    fetchProfileData();
  }, [navigate, user]);

  return (
    <div className={`profile-dashboard-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="profile-dashboard-card">
        <h2 className="profile-dashboard-title">Profile Dashboard</h2>
        {error && <div className="profile-dashboard-error">{error}</div>}
        {success && <div className="profile-dashboard-success">{success}</div>}

        <div className="profile-dashboard-content">
          {/* User Name */}
          <div className="profile-field">
            <label>User Name:</label>
            <span>{profileData.userName}</span>
          </div>

          {/* Email */}
          <div className="profile-field">
            <label>Email:</label>
            <span>{profileData.email}</span>
          </div>

          {/* Mobile Number */}
          <div className="profile-field">
            <label>Mobile Number:</label>
            <span>{profileData.mobNum}</span>
          </div>

          {/* Address */}
          <div className="profile-field">
            <label>Address:</label>
            <span>{profileData.address}</span>
          </div>

          {/* Date of Birth */}
          <div className="profile-field">
            <label>Date of Birth:</label>
            <span>{profileData.dob}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;