import { Bell } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/store/auth";

interface TopbarProps {
  title: string;
  action?: React.ReactNode;
}

export default function Topbar({ title, action }: TopbarProps) {
  const { usuario, logout } = useAuth();

  return (
    <header className="bg-surface border-b border-white/[0.06] px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
      <h1 className="font-condensed font-bold text-xl tracking-wide">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-lg bg-surface2 border border-white/10 flex items-center justify-center text-muted hover:text-white transition-colors">
          <Bell size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {/* CORRIGIDO: Adicionado ?. antes do slice e um fallback 'US' */}
            {(usuario?.usuario?.slice(0, 2) || "US").toUpperCase()}
          </div>
          <span className="text-sm font-medium text-muted hidden sm:block">{usuario?.usuario}</span>
        </div>
        {action}
        <Button variant="ghost" size="sm" onClick={logout}>Sair</Button>
      </div>
    </header>
  );
}