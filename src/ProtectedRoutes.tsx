import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => { 
  const token = sessionStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
