import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { historicoApi } from "@/services/api";
import { formatDateTime } from "@/utils";
import type { Historico } from "@/types";

function getEventIcon(desc: string) {
  if (desc.includes("gol")) return "⚽";
  if (desc.includes("assistência")) return "🅰️";
  if (desc.includes("vermelho")) return "🟥";
  if (desc.includes("amarelo")) return "🟨";
  return "📋";
}

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<Historico[]>([]);

  useEffect(() => {
    historicoApi.listar().then((r) => setHistorico(r.data.data));
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Histórico" />
      <div className="p-6">
        {historico.length === 0 ? (
          <EmptyState icon="📋" title="Nenhum evento registrado" description="Os eventos aparecem aqui após registrar partidas." />
        ) : (
          <Card>
            {historico.map((h, i) => (
              <div
                key={h.id}
                className={`flex items-start gap-4 px-5 py-4 ${i < historico.length - 1 ? "border-b border-white/[0.06]" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-surface2 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                  {getEventIcon(h.descricao)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{h.descricao}</div>
                  <div className="text-xs text-muted mt-0.5">{formatDateTime(h.data_evento)}</div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
