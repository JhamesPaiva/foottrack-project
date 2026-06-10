import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { rankingApi, jogadoresApi } from "@/services/api";
import { useApp } from "@/store/app";
import type { EstatisticaJogador, Jogador } from "@/types";

const MEDAL = ["🥇", "🥈", "🥉"];
const MEDAL_COLORS = [
  "text-yellow-400", "text-slate-300", "text-amber-600",
];

export default function RankingPage() {
  const { selectedTemporada } = useApp();
  const navigate = useNavigate();
  const [ranking, setRanking] = useState<EstatisticaJogador[]>([]);
  const [jogadores, setJogadores] = useState<Record<number, Jogador>>({});
  const [destaques, setDestaques] = useState<{ artilheiro: EstatisticaJogador | null; lider_assistencias: EstatisticaJogador | null }>({
    artilheiro: null, lider_assistencias: null,
  });

  useEffect(() => {
    if (!selectedTemporada) return;
    rankingApi.getRanking(selectedTemporada.id).then((r) => setRanking(r.data.data));
    rankingApi.getDestaques(selectedTemporada.id).then((r) => setDestaques(r.data.data));
    jogadoresApi.listar(selectedTemporada.id).then((r) => {
      const map: Record<number, Jogador> = {};
      r.data.data.forEach((j) => (map[j.id] = j));
      setJogadores(map);
    });
  }, [selectedTemporada]);

  const artilheiro = destaques.artilheiro ? jogadores[destaques.artilheiro.jogador_id] : null;
  const liderAst = destaques.lider_assistencias ? jogadores[destaques.lider_assistencias.jogador_id] : null;

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Ranking" />
      <div className="p-6 space-y-6">
        {!selectedTemporada ? (
          <EmptyState icon="🏆" title="Nenhuma temporada selecionada" description="Configure um time em Configurações." />
        ) : (
          <>
            {/* Destaques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artilheiro && (
                <Card className="p-5 border-primary/30 bg-primary/5">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">🥇 Artilheiro</p>
                  <div className="flex items-center gap-4">
                    <Avatar nome={artilheiro.nome} foto={artilheiro.foto} size="lg" />
                    <div className="flex-1">
                      <div className="font-bold text-base">{artilheiro.nome}</div>
                      <div className="text-xs text-muted">{artilheiro.posicao}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-condensed font-black text-5xl text-primary leading-none">
                        {destaques.artilheiro?.gols}
                      </div>
                      <div className="text-xs text-muted">gols</div>
                    </div>
                  </div>
                </Card>
              )}
              {liderAst && (
                <Card className="p-5 border-blue-500/30 bg-blue-500/5">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">🎯 Líder de Assistências</p>
                  <div className="flex items-center gap-4">
                    <Avatar nome={liderAst.nome} foto={liderAst.foto} size="lg" />
                    <div className="flex-1">
                      <div className="font-bold text-base">{liderAst.nome}</div>
                      <div className="text-xs text-muted">{liderAst.posicao}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-condensed font-black text-5xl text-blue-400 leading-none">
                        {destaques.lider_assistencias?.assistencias}
                      </div>
                      <div className="text-xs text-muted">assistências</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Ranking table */}
            <Card>
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Ranking Geral</p>
                <p className="text-xs text-muted">Gol=5 · Assist=3 · Jogo=1 · 🟨=-1 · 🟥=-3</p>
              </div>
              {ranking.length === 0 ? (
                <div className="py-12 text-center text-muted text-sm">Nenhum dado disponível.</div>
              ) : (
                ranking.map((est, i) => {
                  const j = jogadores[est.jogador_id];
                  if (!j) return null;
                  return (
                    <div
                      key={est.id}
                      className="px-5 py-3 border-b border-white/[0.04] last:border-0 flex items-center gap-4 hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => navigate(`/jogadores/${j.id}`)}
                    >
                      <div className={`w-8 text-center font-condensed font-black text-lg ${MEDAL_COLORS[i] ?? "text-muted"}`}>
                        {i < 3 ? MEDAL[i] : i + 1}
                      </div>
                      <Avatar nome={j.nome} foto={j.foto} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{j.nome}</div>
                        <div className="text-xs text-muted">{j.posicao} · {est.jogos} jogos</div>
                      </div>
                      <div className="flex gap-4 text-sm text-muted">
                        <span title="Gols"><span className="text-primary">⚽</span> {est.gols}</span>
                        <span title="Assistências"><span className="text-blue-400">🅰️</span> {est.assistencias}</span>
                        {est.cartoes_amarelos > 0 && <span>🟨 {est.cartoes_amarelos}</span>}
                        {est.cartoes_vermelhos > 0 && <span>🟥 {est.cartoes_vermelhos}</span>}
                      </div>
                      <div className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-lg font-condensed min-w-[64px] text-center">
                        {est.pontos_ranking} pts
                      </div>
                    </div>
                  );
                })
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
