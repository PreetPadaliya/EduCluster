import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import AdminPanel from "./pages/AdminPanel";
import AnimatedBackground from "./components/AnimatedBackground";
import TestComponent from "./TestComponent";
import "./App.css";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  position: relative;
`;

const Logo = styled(motion.h1)`
  color: #e0e0e0;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
`;

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user data on app initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("educluster_current_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("Restored user from localStorage:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("educluster_current_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Add a debug log to see the current state
  console.log("App render - Current user:", user);

  const handleLogin = (userData) => {
    // Use the complete user data passed from Login component
    const loginUser = {
      enrollmentNo: userData.enrollmentNo,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      username: userData.username, // This is the full name from Login component
    };
    console.log("User logged in:", loginUser);
    setUser(loginUser);
    // Store user data in localStorage for persistence
    localStorage.setItem("educluster_current_user", JSON.stringify(loginUser));
  };

  const handleSignUp = (userData) => {
    // Create a new user object with the signup data
    const newUser = {
      username: userData.firstName + " " + userData.lastName,
      role: userData.role,
      email: userData.email,
      enrollmentNo: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      // Add any additional user properties you want to track
    };

    console.log("User signed up:", newUser);
    // Set the user state to log them in
    setUser(newUser);
    // Store user data in localStorage for persistence
    localStorage.setItem("educluster_current_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    console.log("User logged out");
    setUser(null);
    // Clear user data from localStorage
    localStorage.removeItem("educluster_current_user");
  };

  // Show loading state while checking for stored user data
  if (isLoading) {
    return (
      <AppContainer>
        <AnimatedBackground />
        <div style={{ color: "#e0e0e0", fontSize: "1.2rem" }}>Loading...</div>
      </AppContainer>
    );
  }

  return (
    <Router>
      {user ? (


        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route
            path="/*"
            element={<Home user={user} onLogout={handleLogout} />}

          />
        </Routes>

      ) : (
        <AppContainer>
          <AnimatedBackground />
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/signup"
              element={<SignUp onSignUp={handleSignUp} />}
            />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/test" element={<TestComponent />} />
            <Route path="/*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AppContainer>
      )}
    </Router>
  );
}

export default App;
