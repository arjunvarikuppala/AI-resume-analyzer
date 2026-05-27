import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import ResumeDetailPage from "./pages/ResumeDetailPage";
import { useAuthStore } from "./stores/authStore";
import { useResumeStore } from "./stores/resumeStore";

const ProtectedLayout = () => (
  <ProtectedRoute>
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  </ProtectedRoute>
);

function App() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clearResumeData = useResumeStore((state) => state.clearResumeData);

  useEffect(() => {
    const handleExpiredSession = () => {
      logout();
      clearResumeData();
    };

    window.addEventListener("auth:expired", handleExpiredSession);

    return () => {
      window.removeEventListener("auth:expired", handleExpiredSession);
    };
  }, [clearResumeData, logout]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/resume/:id" element={<ResumeDetailPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
