import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import MainNav from "./components/MainNav.jsx";
import { StudentShell } from "./components/StudentShell.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import TopicPage from "./pages/TopicPage.jsx";
import TestPage from "./pages/TestPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import HistoryReviewPage from "./pages/HistoryReviewPage.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainNav />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StudentShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="library/:topic" element={<TopicPage />} />
            <Route path="test" element={<TestPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="history/:attemptId" element={<HistoryReviewPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
