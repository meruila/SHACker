import React from "react";
import { Navigate } from "react-router-dom";

function Private({ children }) {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
  
    if (!isAuthenticated) {
      // Redirect them to the /login page if they aren't authenticated yet.
      return <Navigate to="/login" replace />;
    }
  
    return children;
  }
  

export default Private;