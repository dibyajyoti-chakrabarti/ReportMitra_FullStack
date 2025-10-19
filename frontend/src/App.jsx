// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import './App.css'
import Landing from './components/Landing'
import Signin from './components/Signin'
import Login from './components/Login'
import Track from './components/Track'
import Report from './components/Report'
import Profile from './components/Profile'
import Callback from './components/Callback'
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/auth/callback" element={<Callback/>}/>
          <Route path="/track" element={
            <ProtectedRoute>
              <Track/>
            </ProtectedRoute>
          }/>
          <Route path="/report" element={
            <ProtectedRoute>
              <Report/>
            </ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App