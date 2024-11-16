// Import Tailwind css
import './App.css';
import './output.css';
// Import Hook
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Import Utils
import { getAuthToken, saveAuthToken } from './utils/useToken';
import { useEffect } from 'react';

export default function App() {
  console.log("-> App rendering ")
  const [user, setUser] = useState("Hello");
  const [org, setOrg] = useState("Hello");
  const token = getAuthToken();
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

  function handleProfile(token) {
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


  function refreshToken(token) {
    fetch(`http://localhost:5000/refresh-token`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include' // Ensures cookies are sent
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.accessToken) {
          console.log("refreshToken success:", data);
          handleProfile(data.accessToken);
          saveAuthToken(data.accessToken);
        } else {
          console.log("refreshToken failed:", data);
        }
      })
      .catch((error) => {
        console.error('refreshToken error:', error);
      });
  }
}

