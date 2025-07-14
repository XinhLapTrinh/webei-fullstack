import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
};

export default GuestOnlyRoute;
