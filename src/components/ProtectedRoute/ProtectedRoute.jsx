import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const authData = JSON.parse(localStorage.getItem("auth"));
  const location = useLocation();

  if (!authData || !authData.isAuth) {
    toast.dismiss();
    toast.error("Please login to access this page");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
