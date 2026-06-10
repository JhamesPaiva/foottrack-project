import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-surface border border-white/[0.08] rounded-xl",
        hover && "cursor-pointer hover:border-primary/50 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
}
