import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from "./pages/admin/Login";
import Dashboard from './pages/admin/Dashboard'

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <div className="min-h-screen bg-slate-900" />
  if (!usuario) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RotaProtegida>
                <Dashboard />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)