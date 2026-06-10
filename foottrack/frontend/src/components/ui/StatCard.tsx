interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  trend?: string;
}

export default function StatCard({ label, value, icon, color = "text-primary", trend }: StatCardProps) {
  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-4 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      {icon && (
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3 text-muted">
          {icon}
        </div>
      )}
      <div className={`font-condensed text-3xl font-black leading-none mb-1 ${color}`}>{value}</div>
      <div className="text-[11px] text-muted uppercase tracking-widest font-semibold">{label}</div>
      {trend && <div className="text-[11px] text-primary mt-1">{trend}</div>}
    </div>
  );
}
