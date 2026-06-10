import axios from "axios";
import type {
  ApiResponse, DashboardResumo, Time, Temporada, Jogador,
  Adversario, Partida, EstatisticaJogador, Historico, EstatisticasTime,
} from "@/types";

const api = axios.create({ baseURL: "/api/v1" });

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ft_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ft_token");
      localStorage.removeItem("ft_usuario");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { usuario: string; senha: string; confirmar_senha: string }) =>
    api.post<ApiResponse<{ token: string; usuario: any }>>("/auth/register", data),
  login: (data: { usuario: string; senha: string }) =>
    api.post<ApiResponse<{ token: string; usuario: any }>>("/auth/login", data),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getResumo: () => api.get<ApiResponse<DashboardResumo>>("/dashboard"),
};

// ─── Times ───────────────────────────────────────────────────────────────────
export const timesApi = {
  listar: () => api.get<ApiResponse<Time[]>>("/times"),
  criar: (data: Partial<Time>) => api.post<ApiResponse<Time>>("/times", data),
  get: (id: number) => api.get<ApiResponse<Time>>(`/times/${id}`),
  atualizar: (id: number, data: Partial<Time>) => api.put<ApiResponse<Time>>(`/times/${id}`, data),
  deletar: (id: number) => api.delete<ApiResponse<null>>(`/times/${id}`),
  uploadEscudo: (id: number, file: File) => {
    const fd = new FormData();
    fd.append("escudo", file);
    return api.post<ApiResponse<Time>>(`/times/${id}/escudo`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ─── Temporadas ───────────────────────────────────────────────────────────────
export const temporadasApi = {
  listar: (timeId: number) =>
    api.get<ApiResponse<Temporada[]>>(`/times/${timeId}/temporadas`),
  criar: (timeId: number, data: Partial<Temporada>) =>
    api.post<ApiResponse<Temporada>>(`/times/${timeId}/temporadas`, data),
  encerrar: (id: number) =>
    api.post<ApiResponse<Temporada>>(`/temporadas/${id}/encerrar`),
  reabrir: (id: number) =>
    api.post<ApiResponse<Temporada>>(`/temporadas/${id}/reabrir`),
};

// ─── Jogadores ───────────────────────────────────────────────────────────────
export const jogadoresApi = {
  listar: (temporadaId: number) =>
    api.get<ApiResponse<Jogador[]>>(`/temporadas/${temporadaId}/jogadores`),
  criar: (temporadaId: number, data: Partial<Jogador>) =>
    api.post<ApiResponse<Jogador>>(`/temporadas/${temporadaId}/jogadores`, data),
  get: (id: number) => api.get<ApiResponse<Jogador>>(`/jogadores/${id}`),
  atualizar: (id: number, data: Partial<Jogador>) =>
    api.put<ApiResponse<Jogador>>(`/jogadores/${id}`, data),
  deletar: (id: number) => api.delete<ApiResponse<null>>(`/jogadores/${id}`),
  uploadFoto: (id: number, file: File) => {
    const fd = new FormData();
    fd.append("foto", file);
    return api.post<ApiResponse<Jogador>>(`/jogadores/${id}/foto`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getHistorico: (id: number) =>
    api.get<ApiResponse<Historico[]>>(`/jogadores/${id}/historico`),
};

// ─── Adversarios ─────────────────────────────────────────────────────────────
export const adversariosApi = {
  listar: () => api.get<ApiResponse<Adversario[]>>("/adversarios"),
  criar: (data: Partial<Adversario>) =>
    api.post<ApiResponse<Adversario>>("/adversarios", data),
  atualizar: (id: number, data: Partial<Adversario>) =>
    api.put<ApiResponse<Adversario>>(`/adversarios/${id}`, data),
  deletar: (id: number) => api.delete<ApiResponse<null>>(`/adversarios/${id}`),
  uploadEscudo: (id: number, file: File) => {
    const fd = new FormData();
    fd.append("escudo", file);
    return api.post<ApiResponse<Adversario>>(`/adversarios/${id}/escudo`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ─── Partidas ─────────────────────────────────────────────────────────────────
export const partidasApi = {
  listar: (temporadaId: number) =>
    api.get<ApiResponse<Partida[]>>(`/temporadas/${temporadaId}/partidas`),
  criar: (temporadaId: number, data: any) =>
    api.post<ApiResponse<Partida>>(`/temporadas/${temporadaId}/partidas`, data),
  get: (id: number) => api.get<ApiResponse<Partida>>(`/partidas/${id}`),
  atualizar: (id: number, data: any) =>
    api.put<ApiResponse<Partida>>(`/partidas/${id}`, data),
  deletar: (id: number) => api.delete<ApiResponse<null>>(`/partidas/${id}`),
  estatisticasTime: (temporadaId: number) =>
    api.get<ApiResponse<EstatisticasTime>>(`/temporadas/${temporadaId}/estatisticas`),
};

// ─── Ranking ──────────────────────────────────────────────────────────────────
export const rankingApi = {
  getRanking: (temporadaId: number) =>
    api.get<ApiResponse<EstatisticaJogador[]>>(`/temporadas/${temporadaId}/ranking`),
  getDestaques: (temporadaId: number) =>
    api.get<ApiResponse<{ artilheiro: EstatisticaJogador | null; lider_assistencias: EstatisticaJogador | null }>>(
      `/temporadas/${temporadaId}/destaques`
    ),
};

// ─── Historico ────────────────────────────────────────────────────────────────
export const historicoApi = {
  listar: () => api.get<ApiResponse<Historico[]>>("/historico"),
};

export default api;
