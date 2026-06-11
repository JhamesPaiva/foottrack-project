import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import { clsx } from "clsx";

type ToastType = "success" | "error" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType) => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  const value = {
    success: (msg: string) => add(msg, "success"),
    error: (msg: string) => add(msg, "error"),
    warning: (msg: string) => add(msg, "warning"),
  };

  const icons = {
    success: <CheckCircle size={16} className="text-primary flex-shrink-0" />,
    error: <XCircle size={16} className="text-red-400 flex-shrink-0" />,
    warning: <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />,
  };

  const borders = {
    success: "border-primary/30",
    error: "border-red-500/30",
    warning: "border-yellow-500/30",
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "bg-surface border rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl",
              borders[t.type]
            )}
          >
            {icons[t.type]}
            <span className="text-sm flex-1">{t.message}</span>
            <button aria-label="Fechar notificação" onClick={() => remove(t.id)} className="text-muted hover:text-white transition-colors">
                <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}