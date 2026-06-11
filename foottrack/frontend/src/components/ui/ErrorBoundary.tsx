import { Component, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: string; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
          <div className="bg-surface border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="font-condensed font-bold text-xl mb-2">Algo deu errado</h2>
            <p className="text-muted text-sm mb-6">{this.state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:bg-green-400 transition-colors"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}