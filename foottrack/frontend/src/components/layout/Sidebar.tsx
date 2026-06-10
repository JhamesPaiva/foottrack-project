import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import {
  LayoutDashboard, Swords, Users, Trophy, Image,
  History, Settings, ChevronDown,
} from "lucide-react";
import { useApp } from "@/store/app";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Partidas", icon: Swords, to: "/partidas" },
  { label: "Jogadores", icon: Users, to: "/jogadores" },
  { label: "Ranking", icon: Trophy, to: "/ranking" },
  { label: "Artes", icon: Image, to: "/artes" },
  { label: "Histórico", icon: History, to: "/historico" },
  { label: "Time & Temporadas", icon: Settings, to: "/configuracoes" },
];

export default function Sidebar() {
  const { selectedTime, selectedTemporada } = useApp();

  return (
    <aside className="w-[220px] bg-surface border-r border-white/[0.06] flex flex-col flex-shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-xl font-black text-black">⚽</div>
          <span className="font-condensed font-black text-[22px] tracking-wide">
            Foot<span className="text-primary">Track</span>
          </span>
        </div>
      </div>

      {/* Team selector */}
      {selectedTime && (
        <div className="m-3 bg-surface2 border border-white/[0.08] rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-xs font-black flex-shrink-0">
            {selectedTime.nome.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{selectedTime.nome}</div>
            <div className="text-[11px] text-muted">
              {selectedTemporada ? `Temporada ${selectedTemporada.nome}` : "Sem temporada"}
            </div>
          </div>
          <ChevronDown size={14} className="text-muted flex-shrink-0" />
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-2">
        <div className="text-[10px] font-bold text-muted/60 uppercase tracking-[1.2px] px-2 pb-1 mb-1">Principal</div>
        {navItems.slice(0, 4).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <div className="text-[10px] font-bold text-muted/60 uppercase tracking-[1.2px] px-2 pb-1 mb-1 mt-4">Conteúdo</div>
        {navItems.slice(4, 6).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <div className="text-[10px] font-bold text-muted/60 uppercase tracking-[1.2px] px-2 pb-1 mb-1 mt-4">Config</div>
        <NavItem {...navItems[6]} />
      </nav>
    </aside>
  );
}

function NavItem({ label, icon: Icon, to }: { label: string; icon: any; to: string }) {
  return (
    <NavLink to={to} end={to === "/"}>
      {({ isActive }) => (
        <div className={clsx(
          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors",
          isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface2 hover:text-white"
        )}>
          <Icon size={16} />
          {label}
        </div>
      )}
    </NavLink>
  );
}
