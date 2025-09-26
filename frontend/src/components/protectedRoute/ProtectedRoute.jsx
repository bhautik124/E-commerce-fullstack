import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  if (!user || !user._id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
