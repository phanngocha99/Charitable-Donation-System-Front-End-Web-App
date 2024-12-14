// Import Tailwind css
import './App.css';
import './output.css';
// Import Hook
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// Import Utils
import { getAuthToken, saveAuthToken, removeAuthToken } from './utils/useToken';
import { useEffect } from 'react';

export default function App() {
  const navigate = useNavigate();
  console.log("-> App rendering ")
  const [user, setUser] = useState("");
  const [org, setOrg] = useState("");
  const token = getAuthToken();
  // console.log('token', token)
  const [isLog, setIsLog] = useState(token);

  useEffect(() => {
    if ((isLog) || user.id) {
      console.log("-> useEffect rendering ")
      handleProfile(token);
    }
  }, []); // empty dependency array means it will only run once

  if (isLog === "" || isLog === null || isLog === undefined) {
    console.log("-> NotAuth rendering ")
    return (
      <div>
        <Navigate to="/notAuth/login" replace />
        <Outlet context={{ auth: { user, setUser }, isLog: { isLog, setIsLog }, org: { org, setOrg } }} />
      </div>
    );
  } else {
    console.log("-> Auth rendering ")
    return (
      <div>
        <Navigate to="/auth/homepage" replace />
        <Outlet context={{ auth: { user, setUser }, isLog: { isLog, setIsLog }, org: { org, setOrg } }} />
      </div>
    );
  }

  async function handleProfile(token) {
    fetch(`http://localhost:5000/me`, {
      method: "GET",
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          console.log("Profile loaded");
          setUser(response);
        } else {
          console.log("Profile load failed");
        }
      })
      .catch((error) => {
        console.error('Profile fetch error:', error);
        console.log("Profile load failed");
        refreshToken(token);
      });
  }

  async function refreshToken(token) {
    try {
      const response = await fetch(`http://localhost:5000/refresh-token`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include', // Ensures cookies are sent with the request
      });

      if (!response.ok) {
        // Handle HTTP errors
        console.error(`refreshToken failed with status: ${response.status}`);
        handleSessionTimeout();
        return;
      }

      const data = await response.json();

      if (data.accessToken) {
        console.log("refreshToken success:", data);
        handleProfile(data.accessToken);
        saveAuthToken(data.accessToken);
      } else {
        console.error("refreshToken response did not include accessToken:", data);
        handleSessionTimeout();
      }
    } catch (error) {
      // Handle network or other unexpected errors
      console.error('refreshToken error:', error);
      handleSessionTimeout();
    }
  }

  function handleSessionTimeout() {
    navigate("/notAuth/login");
    removeAuthToken();
    setUser({ token: '', phoneNumber: '', email: '', role: '' });
    setIsLog(false);
    console.log("Logged out successfully because session timeout");
  }
}

