import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Servicos from "./pages/Servicos";
import Funcionarios from "./pages/Funcionarios";
import Clientes from "./pages/Clientes";
import Perfil from "./pages/Perfil";

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/agenda"
            element={
              <PrivateRoute>
                <Agenda />
              </PrivateRoute>
            }
          />
          <Route
            path="/salao"
            element={
              <PrivateRoute>
                < Servicos/>
              </PrivateRoute>
            }
          />
          <Route
            path="/funcionario"
            element={
              <PrivateRoute>
                <Funcionarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            }
          />
          <Route
            path="/financeiro"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
