import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthUser } from "../Hooks/useAuthUser.jsx";

export default function ProtectedLayout() {
  const location = useLocation();
  const { authUser, isLoading, isError } = useAuthUser();
  const isOnboarding = authUser?.isOnboarding;
  console.log("authUser:", authUser);
  console.log("isOnboarding:", isOnboarding);
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  if (isError || !authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (isOnboarding && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
