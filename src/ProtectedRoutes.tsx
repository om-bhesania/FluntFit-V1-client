import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = ({ children }: any) => {
 console.log(children);
  const token = sessionStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
