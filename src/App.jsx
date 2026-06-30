import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudentShell } from "./components/StudentShell.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import TopicPage from "./pages/TopicPage.jsx";
import TestPage from "./pages/TestPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student" element={<StudentShell />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="library/:topic" element={<TopicPage />} />
          <Route path="test" element={<TestPage />} />
        </Route>
        <Route path="/" element={<Navigate replace to="/student/dashboard" />} />
        <Route path="*" element={<Navigate replace to="/student/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
