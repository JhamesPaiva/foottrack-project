import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "@/store/auth";
import { AppContext } from "@/store/app";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import JogadoresPage from "@/pages/jogadores/JogadoresPage";
import JogadorPerfilPage from "@/pages/jogadores/JogadorPerfilPage";
import PartidasPage from "@/pages/partidas/PartidasPage";
import RankingPage from "@/pages/ranking/RankingPage";
import ArtesPage from "@/pages/artes/ArtesPage";
import HistoricoPage from "@/pages/historico/HistoricoPage";
import ConfiguracoesPage from "@/pages/times/ConfiguracoesPage";
import type { Usuario, Time, Temporada } from "@/types";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("ft_token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("ft_token"));
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    try { return JSON.parse(localStorage.getItem("ft_usuario") || "null"); } catch { return null; }
  });
  const [selectedTime, setSelectedTime] = useState<Time | null>(null);
  const [selectedTemporada, setSelectedTemporada] = useState<Temporada | null>(null);

  const login = (t: string, u: Usuario) => {
    localStorage.setItem("ft_token", t);
    localStorage.setItem("ft_usuario", JSON.stringify(u));
    setToken(t);
    setUsuario(u);
  };

  const logout = () => {
    localStorage.removeItem("ft_token");
    localStorage.removeItem("ft_usuario");
    setToken(null);
    setUsuario(null);
    setSelectedTime(null);
    setSelectedTemporada(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, isAuthenticated: !!token }}>
      <AppContext.Provider value={{ selectedTime, selectedTemporada, setSelectedTime, setSelectedTemporada }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route index element={<DashboardPage />} />
              <Route path="jogadores" element={<JogadoresPage />} />
              <Route path="jogadores/:id" element={<JogadorPerfilPage />} />
              <Route path="partidas" element={<PartidasPage />} />
              <Route path="ranking" element={<RankingPage />} />
              <Route path="artes" element={<ArtesPage />} />
              <Route path="historico" element={<HistoricoPage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}
