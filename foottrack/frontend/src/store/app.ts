import { createContext, useContext } from "react";
import type { Time, Temporada } from "@/types";

export interface AppContextType {
  selectedTime: Time | null;
  selectedTemporada: Temporada | null;
  setSelectedTime: (time: Time | null) => void;
  setSelectedTemporada: (temporada: Temporada | null) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
