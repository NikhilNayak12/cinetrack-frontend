import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadFilm from "./pages/UploadFilm";
import FilmDetails from "./pages/FilmDetails";
import MySubmissions from "./pages/MySubmissions";
import JudgePanel from "./pages/JudgePanel";
import JudgeTaskList from "./pages/JudgeTaskList";
import JudgeTaskDetail from "./pages/JudgeTaskDetail";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111827",
            color: "#f9fafb",
            border: "1px solid #1f2937",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/films/upload"
          element={
            <ProtectedRoute>
              <UploadFilm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/films/my"
          element={
            <ProtectedRoute>
              <MySubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/films/:id"
          element={
            <ProtectedRoute>
              <FilmDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge"
          element={
            <ProtectedRoute>
              <JudgePanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge/tasks"
          element={
            <ProtectedRoute>
              <JudgeTaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge/tasks/:id"
          element={
            <ProtectedRoute>
              <JudgeTaskDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
