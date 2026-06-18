import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* Botão Voltar com aria-label corrigido */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
        className="w-8 h-8 rounded-lg bg-surface2 border border-white/10 flex items-center justify-center text-muted hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
      </button>

      {visiblePages.map((p, i) => {
        const prev = visiblePages[i - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <div key={p} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="w-8 h-8 flex items-center justify-center text-muted text-sm">...</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={clsx(
                "w-8 h-8 rounded-lg text-sm font-semibold transition-colors",
                p === page
                  ? "bg-primary text-black"
                  : "bg-surface2 border border-white/10 text-muted hover:text-white hover:border-white/30"
              )}
            >
              {p}
            </button>
          </div>
        );
      })}

      {/* Botão Avançar com aria-label corrigido */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Próxima página"
        className="w-8 h-8 rounded-lg bg-surface2 border border-white/10 flex items-center justify-center text-muted hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}