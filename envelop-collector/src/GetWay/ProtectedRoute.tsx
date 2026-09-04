
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Check if the user session exists
  const isAuthenticated = sessionStorage.getItem("Current_Controller");

  // If not logged in, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If logged in, render the child routes
  return <Outlet />;
}