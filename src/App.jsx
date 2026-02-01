import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PlayerDashboard from "./pages/PlayerDashboard";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import client from "./api/client";
import { PageLoader } from "./components/Loader";

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const logVisit = async () => {
      try {
        // Replace '/analytics/visit' with your actual endpoint
        await client.get('/matches', { 
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent 
        });
        console.log("Visit logged successfully");
      } catch (error) {
        // Fail silently so the user experience isn't affected
        console.error("Failed to log visit:", error);
      }
      finally{
        setIsAppLoading(false);
      }
    };

    logVisit();
  }, []); // <--- Empty dependency array ensures this runs only once on mount

  if (isAppLoading) {
    return <PageLoader />;
  }


  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
        <ThemeToggle></ThemeToggle>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="organizer">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/player"
              element={
                <PrivateRoute role="player">
                  <PlayerDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
