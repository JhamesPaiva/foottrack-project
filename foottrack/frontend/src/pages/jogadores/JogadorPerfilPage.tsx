import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { jogadoresApi } from "@/services/api";
import { formatDate } from "@/utils";
import type { Jogador, Historico } from "@/types";

const CONQUISTAS = [
  { id: "primeiro_gol", icon: "⚽", label: "Primeiro Gol", check: (j: Jogador) => (j.estatisticas?.gols ?? 0) >= 1 },
  { id: "10_gols", icon: "🔟", label: "10 Gols", check: (j: Jogador) => (j.estatisticas?.gols ?? 0) >= 10 },
  { id: "25_gols", icon: "🏅", label: "25 Gols", check: (j: Jogador) => (j.estatisticas?.gols ?? 0) >= 25 },
  { id: "50_gols", icon: "🥇", label: "50 Gols", check: (j: Jogador) => (j.estatisticas?.gols ?? 0) >= 50 },
  { id: "100_jogos", icon: "💯", label: "100 Jogos", check: (j: Jogador) => (j.estatisticas?.jogos ?? 0) >= 100 },
];

export default function JogadorPerfilPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [historico, setHistorico] = useState<Historico[]>([]);

  useEffect(() => {
    if (!id) return;
    jogadoresApi.get(Number(id)).then((r) => setJogador(r.data.data));
    jogadoresApi.getHistorico(Number(id)).then((r) => setHistorico(r.data.data));
  }, [id]);

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    const r = await jogadoresApi.uploadFoto(Number(id), file);
    setJogador(r.data.data);
  };

  if (!jogador) return <div className="flex-1 flex items-center justify-center text-muted">Carregando...</div>;

  const est = jogador.estatisticas;
  const evolucaoGols = historico
    .filter((h) => h.descricao.includes("gol"))
    .slice(0, 6)
    .reverse()
    .map((h, i) => ({ i: i + 1, gols: i + 1 }));

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Perfil do Jogador" />
      <div className="p-6 space-y-6">

        <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>
          Voltar
        </Button>

        {/* Header */}
        <Card className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <Avatar nome={jogador.nome} foto={jogador.foto} size="xl" />
            <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Upload size={20} className="text-white" />
              <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleUploadFoto} />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-condensed font-black text-3xl">{jogador.nome}</h2>
            <Badge variant="primary" className="mt-2">{jogador.posicao || "Sem posição"}</Badge>
            <p className="text-sm text-muted mt-2">Temporada ativa · {jogador.temporada_id}</p>
          </div>
          {/* Mini evolution */}
          {evolucaoGols.length > 0 && (
            <div className="w-36 text-center">
              <ResponsiveContainer width="100%" height={50}>
                <LineChart data={evolucaoGols}>
                  <Line type="monotone" dataKey="gols" stroke="#22C55E" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-[10px] text-muted mt-1">Evolução de gols</div>
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Jogos", val: est?.jogos ?? 0, color: "text-white" },
            { label: "Gols", val: est?.gols ?? 0, color: "text-primary" },
            { label: "Assistências", val: est?.assistencias ?? 0, color: "text-blue-400" },
            { label: "Cart. Amarelos", val: est?.cartoes_amarelos ?? 0, color: "text-yellow-400" },
            { label: "Cart. Vermelhos", val: est?.cartoes_vermelhos ?? 0, color: "text-red-400" },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center">
              <div className={`font-condensed text-4xl font-black leading-none mb-1 ${s.color}`}>{s.val}</div>
              <div className="text-[11px] text-muted uppercase tracking-wider">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Ranking Points */}
        <Card className="p-4 flex items-center gap-4">
          <div className="font-condensed text-5xl font-black text-primary leading-none">{est?.pontos_ranking ?? 0}</div>
          <div>
            <div className="font-bold">Pontos no Ranking</div>
            <div className="text-xs text-muted">Gol=5pts · Assist=3pts · Jogo=1pt · 🟨=-1 · 🟥=-3</div>
          </div>
        </Card>

        {/* Conquistas */}
        <div>
          <h3 className="font-condensed font-bold text-lg mb-3">Conquistas</h3>
          <div className="flex flex-wrap gap-3">
            {CONQUISTAS.map((c) => {
              const unlocked = c.check(jogador);
              return (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-opacity ${
                    unlocked
                      ? "bg-surface border-primary/30"
                      : "bg-surface border-white/[0.06] opacity-40"
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{c.label}</div>
                    <div className="text-xs text-muted">{unlocked ? "Conquistado" : "Em andamento"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Histórico */}
        {historico.length > 0 && (
          <div>
            <h3 className="font-condensed font-bold text-lg mb-3">Histórico de Eventos</h3>
            <Card>
              {historico.slice(0, 10).map((h, i) => (
                <div
                  key={h.id}
                  className={`flex items-start gap-3 px-5 py-3 ${i < historico.length - 1 ? "border-b border-white/[0.06]" : ""}`}
                >
                  <div className="text-xl mt-0.5">
                    {h.descricao.includes("gol") ? "⚽" :
                     h.descricao.includes("assistência") ? "🅰️" :
                     h.descricao.includes("vermelho") ? "🟥" :
                     h.descricao.includes("amarelo") ? "🟨" : "📋"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{h.descricao}</div>
                    <div className="text-xs text-muted mt-0.5">{formatDate(h.data_evento)}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
