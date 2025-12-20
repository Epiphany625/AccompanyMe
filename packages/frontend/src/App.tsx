import { Route, Routes } from "react-router-dom"
import axios from "axios"
import "./App.css"
import { AuthPage } from "./pages/AuthPage"
import { LandingPage } from "./pages/LandingPage"

// Store: global state. 
// 
export const App = () => {
  axios.defaults.withCredentials = true; // every request requires an authentication
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<LandingPage />} />
    </Routes>
  )
}
