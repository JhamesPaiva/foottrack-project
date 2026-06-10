import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "yellow" | "red" | "blue" | "muted";
  className?: string;
}

const variants = {
  primary: "bg-primary/10 text-primary",
  yellow: "bg-yellow-500/10 text-yellow-400",
  red: "bg-red-500/10 text-red-400",
  blue: "bg-blue-500/10 text-blue-400",
  muted: "bg-white/5 text-muted",
};

export default function Badge({ children, variant = "muted", className }: BadgeProps) {
  return (
    <span className={clsx("text-xs font-bold uppercase px-2 py-0.5 rounded-md tracking-wide", variants[variant], className)}>
      {children}
    </span>
  );
}
