export interface Usuario {
  id: number;
  usuario: string;
  data_criacao: string;
}

export interface AuthState {
  token: string | null;
  usuario: Usuario | null;
}

export interface Time {
  id: number;
  usuario_id: number;
  nome: string;
  cidade?: string;
  categoria?: string;
  ano_fundacao?: number;
  escudo?: string;
}

export interface Temporada {
  id: number;
  time_id: number;
  nome: string;
  data_inicio?: string;
  data_fim?: string;
  status: "ativa" | "encerrada";
}

export type Posicao = "Goleiro" | "Zagueiro" | "Lateral" | "Volante" | "Meio-Campo" | "Atacante";

export interface EstatisticaJogador {
  id: number;
  jogador_id: number;
  jogos: number;
  gols: number;
  assistencias: number;
  cartoes_amarelos: number;
  cartoes_vermelhos: number;
  pontos_ranking: number;
}

export interface Jogador {
  id: number;
  temporada_id: number;
  nome: string;
  posicao?: Posicao;
  foto?: string;
  estatisticas?: EstatisticaJogador;
}

export interface Adversario {
  id: number;
  usuario_id: number;
  nome: string;
  cidade?: string;
  categoria?: string;
  escudo?: string;
}

export type Resultado = "vitoria" | "empate" | "derrota";

export interface EstatisticaPartida {
  id: number;
  partida_id: number;
  jogador_id: number;
  jogador?: Pick<Jogador, "id" | "nome" | "posicao" | "foto">;
  participou: boolean;
  gols: number;
  assistencias: number;
  cartoes_amarelos: number;
  cartoes_vermelhos: number;
}

export interface Partida {
  id: number;
  temporada_id: number;
  adversario_id: number;
  adversario?: Adversario;
  data_partida: string;
  horario?: string;
  local?: string;
  competicao?: string;
  rodada?: string;
  observacoes?: string;
  mandante: boolean;
  gols_pro: number;
  gols_contra: number;
  resultado: Resultado;
  estatisticas?: EstatisticaPartida[];
}

export interface EstatisticaItemForm {
  jogador_id: number;
  participou: boolean;
  gols: number;
  assistencias: number;
  cartoes_amarelos: number;
  cartoes_vermelhos: number;
}

export interface DashboardResumo {
  total_times: number;
  total_jogadores: number;
  total_partidas: number;
  total_gols: number;
  total_assistencias: number;
  total_amarelos: number;
  total_vermelhos: number;
  aproveitamento_geral: number;
}

export interface EstatisticasTime {
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gols_pro: number;
  gols_contra: number;
  saldo_gols: number;
  aproveitamento: number;
}

export interface Historico {
  id: number;
  usuario_id: number;
  jogador_id?: number;
  partida_id?: number;
  jogador?: Pick<Jogador, "id" | "nome">;
  descricao: string;
  data_evento: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}
