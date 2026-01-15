import { Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import "./App.css";
import Landing from "./components/Landing";
import Signin from "./components/Signin";
import Login from "./components/Login";
import Track from "./components/Track";
import Report from "./components/Report";
import Profile from "./components/Profile";
import Callback from "./components/Callback";
import Community from "./components/Community";
import ProtectedRoute from "./components/ProtectedRoute";
import IssueDetails from "./components/IssueDetails";
import IssueAction from "./components/IssueAction";
import History from "./components/History";
import BackendGate from "./availability/BackendGate";

function App() {
  return (
    <BackendGate>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/auth/callback" element={<Callback />} />
          <Route path="/community" element={<Community />} />
          <Route path="/track" element={<Track />}>
            <Route index element={<Navigate to="details" replace />} />
            <Route path="details" element={<IssueDetails />} />
            <Route path="action" element={<IssueAction />} />
          </Route>
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
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
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BackendGate>
  );
}

export default App;