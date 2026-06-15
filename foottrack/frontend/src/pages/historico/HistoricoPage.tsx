import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
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

const PER_PAGE = 15;

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    historicoApi.listar()
      .then((r) => setHistorico(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(historico.length / PER_PAGE);
  const paginated = historico.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Histórico" />
      <div className="p-6">
        {loading ? (
          <Card>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-white/[0.06]">
                <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </Card>
        ) : historico.length === 0 ? (
          <EmptyState icon="📋" title="Nenhum evento registrado" description="Os eventos aparecem aqui após registrar partidas." />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted">{historico.length} evento{historico.length !== 1 ? "s" : ""} registrado{historico.length !== 1 ? "s" : ""}</p>
            </div>
            <Card>
              {paginated.map((h, i) => (
                <div
                  key={h.id}
                  className={`flex items-start gap-4 px-5 py-4 ${i < paginated.length - 1 ? "border-b border-white/[0.06]" : ""}`}
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
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}