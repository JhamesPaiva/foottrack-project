import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import { partidasApi, jogadoresApi, rankingApi } from "@/services/api";
import { useApp } from "@/store/app";
import { getResultadoLabel } from "@/utils";
import type { Partida, Jogador, EstatisticaJogador } from "@/types";

type ArtType = "pos-jogo" | "artilharia" | "assistencias";
type ExportFormat = "PNG" | "JPG" | "PDF";
type ExportSize = "1080x1080" | "1080x1920" | "1200x630" | "1600x900";

const SIZES: { label: string; value: ExportSize }[] = [
  { label: "Instagram Feed (1080×1080)", value: "1080x1080" },
  { label: "Instagram Story (1080×1920)", value: "1080x1920" },
  { label: "Facebook (1200×630)", value: "1200x630" },
  { label: "X / Twitter (1600×900)", value: "1600x900" },
];

export default function ArtesPage() {
  const { selectedTemporada } = useApp();
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [ranking, setRanking] = useState<EstatisticaJogador[]>([]);
  const [artType, setArtType] = useState<ArtType>("pos-jogo");
  const [selectedPartida, setSelectedPartida] = useState<string>("");
  const [exportSize, setExportSize] = useState<ExportSize>("1080x1080");
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedTemporada) return;
    partidasApi.listar(selectedTemporada.id).then((r) => {
      setPartidas(r.data.data);
      if (r.data.data.length) setSelectedPartida(String(r.data.data[0].id));
    });
    jogadoresApi.listar(selectedTemporada.id).then((r) => setJogadores(r.data.data));
    rankingApi.getRanking(selectedTemporada.id).then((r) => setRanking(r.data.data));
  }, [selectedTemporada]);

  const partida = partidas.find((p) => String(p.id) === selectedPartida);

  const exportArt = async (format: ExportFormat) => {
    if (!artRef.current) return;
    const canvas = await html2canvas(artRef.current, { scale: 2, backgroundColor: "#0F172A", useCORS: true });

    if (format === "PDF") {
      const [w, h] = exportSize.split("x").map(Number);
      const pdf = new jsPDF({ orientation: w > h ? "landscape" : "portrait", unit: "px", format: [w, h] });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.9), "JPEG", 0, 0, w, h);
      pdf.save(`foottrack-arte.pdf`);
    } else {
      const link = document.createElement("a");
      link.download = `foottrack-arte.${format.toLowerCase()}`;
      link.href = canvas.toDataURL(format === "PNG" ? "image/png" : "image/jpeg", 0.9);
      link.click();
    }
  };

  const jogadoresMap = Object.fromEntries(jogadores.map((j) => [j.id, j]));
  const rankingComNome = ranking.map((r) => ({ ...r, jogador: jogadoresMap[r.jogador_id] })).filter((r) => r.jogador);

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Artes para Redes Sociais" />
      <div className="p-6 space-y-6">
        {!selectedTemporada ? (
          <EmptyState icon="🎨" title="Nenhuma temporada selecionada" description="Configure um time em Configurações." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <Card className="p-5 space-y-4">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Tipo de Arte</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["pos-jogo", "artilharia", "assistencias"] as ArtType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setArtType(t)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        artType === t ? "border-primary text-primary bg-primary/10" : "border-white/10 text-muted hover:border-white/30"
                      }`}
                    >
                      {t === "pos-jogo" ? "Pós-Jogo" : t === "artilharia" ? "Artilharia" : "Assistências"}
                    </button>
                  ))}
                </div>

                {artType === "pos-jogo" && partidas.length > 0 && (
                  <Select
                    label="Selecionar Partida"
                    options={partidas.map((p) => ({
                      value: p.id,
                      label: `${p.adversario?.nome ?? "Adversário"} — ${p.gols_pro}x${p.gols_contra} (${p.data_partida})`,
                    }))}
                    value={selectedPartida}
                    onChange={(e) => setSelectedPartida(e.target.value)}
                  />
                )}

                <Select
                  label="Formato de Exportação"
                  options={SIZES}
                  value={exportSize}
                  onChange={(e) => setExportSize(e.target.value as ExportSize)}
                />
              </Card>

              <Card className="p-5 space-y-3">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Exportar</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["PNG", "JPG", "PDF"] as ExportFormat[]).map((f) => (
                    <Button key={f} variant="ghost" icon={<Download size={14} />} onClick={() => exportArt(f)}>
                      {f}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Preview */}
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Preview</p>
              <div
                ref={artRef}
                className="rounded-2xl overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)", minHeight: 340 }}
              >
                {artType === "pos-jogo" && partida ? (
                  <PosJogoArt partida={partida} />
                ) : artType === "artilharia" ? (
                  <RankingArt title="⚽ Artilharia" items={rankingComNome.slice(0, 5).map((r) => ({ nome: r.jogador.nome, val: r.gols, label: "gols" }))} />
                ) : (
                  <RankingArt title="🎯 Assistências" items={rankingComNome.slice(0, 5).map((r) => ({ nome: r.jogador.nome, val: r.assistencias, label: "ast." }))} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PosJogoArt({ partida }: { partida: Partida }) {
  const artilheiros = partida.estatisticas?.filter((e) => e.gols > 0) ?? [];
  return (
    <div style={{ padding: 40, fontFamily: "Barlow Condensed, sans-serif" }}>
      <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
        {partida.competicao ?? "Partida"} {partida.rodada ? `· ${partida.rodada}` : ""}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "white", margin: "0 auto 10px" }}>GA</div>
          <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16 }}>Grêmio Atlético</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: 56, fontWeight: 900, color: partida.resultado === "vitoria" ? "#22C55E" : partida.resultado === "empate" ? "#EAB308" : "#EF4444", letterSpacing: 4 }}>
            {partida.gols_pro} – {partida.gols_contra}
          </div>
          <div style={{ color: "#94A3B8", fontSize: 12 }}>{partida.data_partida}</div>
          <div style={{ display: "inline-block", background: partida.resultado === "vitoria" ? "rgba(34,197,94,0.15)" : partida.resultado === "empate" ? "rgba(234,179,8,0.15)" : "rgba(239,68,68,0.15)", color: partida.resultado === "vitoria" ? "#22C55E" : partida.resultado === "empate" ? "#EAB308" : "#EF4444", padding: "3px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 }}>
            {getResultadoLabel(partida.resultado)}
          </div>
        </div>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#dc2626,#991b1b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "white", margin: "0 auto 10px" }}>
            {partida.adversario?.nome?.slice(0, 2).toUpperCase() ?? "AD"}
          </div>
          <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16 }}>{partida.adversario?.nome ?? "Adversário"}</div>
        </div>
      </div>
      {artilheiros.length > 0 && (
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: "#94A3B8", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Artilheiros</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {artilheiros.map((e) => (
              <div key={e.id} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "4px 12px", color: "#F8FAFC", fontSize: 13 }}>
                ⚽ {e.jogador?.nome ?? `#${e.jogador_id}`} ({e.gols})
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 24, textAlign: "center", color: "#22C55E", fontSize: 13, fontWeight: 700, letterSpacing: 3 }}>
        FOOTTRACK
      </div>
    </div>
  );
}

function RankingArt({ title, items }: { title: string; items: { nome: string; val: number; label: string }[] }) {
  return (
    <div style={{ padding: 40, fontFamily: "Barlow Condensed, sans-serif" }}>
      <div style={{ textAlign: "center", color: "#22C55E", fontSize: 20, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 28 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: i === 0 ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 22 }}>{["🥇","🥈","🥉"][i] ?? `${i+1}.`}</div>
            <div style={{ flex: 1, color: "#F8FAFC", fontSize: 16, fontWeight: 700 }}>{item.nome}</div>
            <div style={{ color: i === 0 ? "#22C55E" : "#94A3B8", fontSize: 22, fontWeight: 900 }}>{item.val} <span style={{ fontSize: 13 }}>{item.label}</span></div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, textAlign: "center", color: "#22C55E", fontSize: 13, fontWeight: 700, letterSpacing: 3 }}>FOOTTRACK</div>
    </div>
  );
}
