import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Users, Swords, Target, TrendingUp,
  AlertTriangle, Award,
} from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonStatCard } from "@/components/ui/Skeleton";
import { jogadoresApi, partidasApi } from "@/services/api";
import { useApp } from "@/store/app";
import type { EstatisticasTime, Jogador } from "@/types";

const PIE_COLORS = ["#22C55E", "#EAB308", "#EF4444"];
const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export default function DashboardPage() {
  const { selectedTime, selectedTemporada } = useApp();
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [statsTime, setStatsTime] = useState<EstatisticasTime | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedTemporada) {
      setJogadores([]);
      setStatsTime(null);
      return;
    }
    setLoading(true);
    Promise.all([
      jogadoresApi.listar(selectedTemporada.id),
      partidasApi.estatisticasTime(selectedTemporada.id),
    ]).then(([jogRes, statsRes]) => {
      setJogadores(jogRes.data.data);
      setStatsTime(statsRes.data.data);
    }).finally(() => setLoading(false));
  }, [selectedTemporada]);

  const totalGols = jogadores.reduce((s, j) => s + (j.estatisticas?.gols ?? 0), 0);
  const totalAssistencias = jogadores.reduce((s, j) => s + (j.estatisticas?.assistencias ?? 0), 0);
  const totalAmarelos = jogadores.reduce((s, j) => s + (j.estatisticas?.cartoes_amarelos ?? 0), 0);
  const totalVermelhos = jogadores.reduce((s, j) => s + (j.estatisticas?.cartoes_vermelhos ?? 0), 0);

  const pieData = statsTime
    ? [
        { name: "Vitórias", value: statsTime.vitorias },
        { name: "Empates", value: statsTime.empates },
        { name: "Derrotas", value: statsTime.derrotas },
      ]
    : [];

  const mesAtual = new Date().getMonth();
  const barData = MESES.slice(0, mesAtual + 1).map((m) => ({
    mes: m, gols: 0, assistencias: 0,
  }));

  if (!selectedTemporada) {
    return (
      <div className="flex flex-col flex-1">
        <Topbar title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon="⚽"
            title="Nenhuma temporada selecionada"
            description="Vá em Configurações, selecione um time e uma temporada para ver o dashboard."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6">

        {/* Nome do time */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center font-black text-sm">
            {selectedTime?.nome?.slice(0, 2).toUpperCase() ?? "??"}
          </div>
          <div>
            <div className="font-bold text-base">{selectedTime?.nome ?? "Time"}</div>
            <div className="text-xs text-muted">
              Temporada {selectedTemporada.nome} · {selectedTemporada.status === "ativa" ? "Ativa" : "Encerrada"}
            </div>
          </div>
        </div>

        {/* Stat Cards linha 1 */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Jogadores" value={jogadores.length}
              icon={<Users size={18} />} trend={`${jogadores.length}/40 cadastrados`}
            />
            <StatCard
              label="Partidas" value={statsTime?.jogos ?? 0}
              icon={<Swords size={18} />} color="text-blue-400"
              trend={statsTime ? `${statsTime.vitorias}V ${statsTime.empates}E ${statsTime.derrotas}D` : "—"}
            />
            <StatCard
              label="Gols Marcados" value={totalGols}
              icon={<Target size={18} />} color="text-yellow-400"
              trend={statsTime && statsTime.jogos > 0 ? `Média ${(totalGols / statsTime.jogos).toFixed(1)}/jogo` : ""}
            />
            <StatCard
              label="Aproveitamento" value={statsTime ? `${statsTime.aproveitamento}%` : "0%"}
              icon={<TrendingUp size={18} />} color="text-orange-400"
            />
          </div>
        )}

        {/* Stat Cards linha 2 */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Assistências" value={totalAssistencias} color="text-blue-400" />
            <StatCard label="Cart. Amarelos" value={totalAmarelos} color="text-yellow-400" icon={<AlertTriangle size={18} />} />
            <StatCard label="Cart. Vermelhos" value={totalVermelhos} color="text-red-400" />
            <StatCard
              label="Saldo de Gols"
              value={statsTime ? (statsTime.saldo_gols >= 0 ? `+${statsTime.saldo_gols}` : statsTime.saldo_gols) : 0}
              icon={<Award size={18} />} color="text-primary"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-5">
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Gols & Assistências por Mês</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={14}>
                <XAxis dataKey="mes" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#F8FAFC" }} />
                <Bar dataKey="gols" fill="#22C55E" radius={[4, 4, 0, 0]} name="Gols" />
                <Bar dataKey="assistencias" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Assistências" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Resultados</p>
            {loading ? (
              <div className="h-32 flex items-center justify-center text-muted text-sm">Carregando...</div>
            ) : statsTime && statsTime.jogos > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {[
                    { label: "Vitórias", val: statsTime.vitorias, color: "bg-primary" },
                    { label: "Empates", val: statsTime.empates, color: "bg-yellow-400" },
                    { label: "Derrotas", val: statsTime.derrotas, color: "bg-red-400" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-muted flex-1">{item.label}</span>
                      <span className="font-bold">{item.val}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted text-sm">
                Nenhuma partida registrada
              </div>
            )}
          </Card>
        </div>

        {/* Estatísticas completas */}
        {statsTime && !loading && (
          <Card className="p-5">
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">
              Estatísticas do Time — Temporada {selectedTemporada.nome}
            </p>
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { label: "Jogos", val: statsTime.jogos },
                { label: "Vitórias", val: statsTime.vitorias },
                { label: "Empates", val: statsTime.empates },
                { label: "Derrotas", val: statsTime.derrotas },
                { label: "Gols Pró", val: statsTime.gols_pro },
                { label: "Gols Contra", val: statsTime.gols_contra },
                { label: "Saldo", val: statsTime.saldo_gols >= 0 ? `+${statsTime.saldo_gols}` : statsTime.saldo_gols },
                { label: "Aproveit.", val: `${statsTime.aproveitamento}%` },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-condensed text-2xl font-black text-primary">{s.val}</div>
                  <div className="text-[10px] text-muted uppercase tracking-wide mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}