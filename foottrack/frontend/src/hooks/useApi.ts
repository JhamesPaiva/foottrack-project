import { useState, useCallback } from "react";
import type { AxiosError } from "axios";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (fn: () => Promise<{ data: { data: T } }>) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fn();
      setState({ data: res.data.data, loading: false, error: null });
      return res.data.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const msg = axiosErr.response?.data?.message || "Erro inesperado.";
      setState((s) => ({ ...s, loading: false, error: msg }));
      throw err;
    }
  }, []);

  return { ...state, execute };
}
