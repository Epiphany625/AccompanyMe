import { Route, Routes } from "react-router-dom"
import "./App.css"
import { AuthPage } from "./pages/AuthPage"
import { LandingPage } from "./pages/LandingPage"

// Store: global state. 
// 
export const App = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/dashboard" element={<LandingPage />} />
  </Routes>
)
