import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = useSelector((s) => s.user);
  if (user) return <Navigate to="/feed" replace />;
  return <Outlet />;
};

export default PublicRoute;

