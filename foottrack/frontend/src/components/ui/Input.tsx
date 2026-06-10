import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</label>}
    <input
      ref={ref}
      className={clsx(
        "bg-surface2 border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/50 outline-none transition-colors",
        error ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary",
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Input.displayName = "Input";
export default Input;
