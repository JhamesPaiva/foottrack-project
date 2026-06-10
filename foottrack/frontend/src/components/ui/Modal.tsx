import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export default function Modal({ open, onClose, title, children, width = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`bg-surface border border-white/10 rounded-2xl w-full ${width} shadow-2xl`}>
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <h2 className="font-condensed font-bold text-lg">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} icon={<X size={14} />} />
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
