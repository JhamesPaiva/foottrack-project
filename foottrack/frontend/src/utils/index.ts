import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: string) =>
  format(parseISO(date), "dd MMM yyyy", { locale: ptBR });

export const formatDateTime = (date: string) =>
  format(parseISO(date), "dd MMM yyyy HH:mm", { locale: ptBR });

export const getInitials = (nome: string) =>
  nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const getResultadoColor = (resultado: string) => {
  if (resultado === "vitoria") return "text-green-400";
  if (resultado === "empate") return "text-yellow-400";
  return "text-red-400";
};

export const getResultadoLabel = (resultado: string) => {
  if (resultado === "vitoria") return "Vitória";
  if (resultado === "empate") return "Empate";
  return "Derrota";
};

export const getResultadoBadgeClass = (resultado: string) => {
  if (resultado === "vitoria") return "bg-green-500/10 text-green-400";
  if (resultado === "empate") return "bg-yellow-500/10 text-yellow-400";
  return "bg-red-500/10 text-red-400";
};

export const POSICOES = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meio-Campo", "Atacante"] as const;

export const AVATAR_COLORS = [
  "bg-green-500/20 text-green-400",
  "bg-blue-500/20 text-blue-400",
  "bg-orange-500/20 text-orange-400",
  "bg-purple-500/20 text-purple-400",
  "bg-teal-500/20 text-teal-400",
  "bg-pink-500/20 text-pink-400",
  "bg-yellow-500/20 text-yellow-400",
];

export const getAvatarColor = (nome: string) =>
  AVATAR_COLORS[nome.charCodeAt(0) % AVATAR_COLORS.length];
