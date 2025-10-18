import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Landing from './components/Landing'
import Signin from './components/Signin'
import Login from './components/Login'
import Track from './components/Track'
import Report from './components/Report'
import Profile from './components/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Signin" element={<Signin/>}/>
        <Route path="/Track" element={<Track/>}/>
        <Route path="/Report" element={<Report/>}/>
        <Route path="/Profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
