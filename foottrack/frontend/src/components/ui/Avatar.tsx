import { clsx } from "clsx";
import { getInitials, getAvatarColor } from "@/utils";

interface AvatarProps {
  nome: string;
  foto?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-2xl" };

export default function Avatar({ nome, foto, size = "md", className }: AvatarProps) {
  const color = getAvatarColor(nome);
  return foto ? (
    <img src={`/api/v1/uploads/${foto}`} alt={nome}
      className={clsx("rounded-full object-cover", sizes[size], className)} />
  ) : (
    <div className={clsx("rounded-full flex items-center justify-center font-bold", sizes[size], color, className)}>
      {getInitials(nome)}
    </div>
  );
}
