from app.repositories import TimeRepository, TemporadaRepository, JogadorRepository, PartidaRepository


class DashboardService:
    def __init__(self) -> None:
        self.time_repo = TimeRepository()
        self.temp_repo = TemporadaRepository()
        self.jog_repo = JogadorRepository()
        self.part_repo = PartidaRepository()

    def get_resumo(self, usuario_id: int) -> dict:
        times = self.time_repo.get_by_usuario(usuario_id)
        total_jogadores = 0
        total_partidas = 0
        total_gols = 0
        total_assistencias = 0
        total_amarelos = 0
        total_vermelhos = 0
        total_vitorias = 0
        total_jogos_aproveitamento = 0

        for time in times:
            temporadas = self.temp_repo.get_by_time(time.id)
            for temp in temporadas:
                jogadores = self.jog_repo.get_by_temporada(temp.id)
                total_jogadores += len(jogadores)
                for j in jogadores:
                    if j.estatisticas:
                        total_gols += j.estatisticas.gols
                        total_assistencias += j.estatisticas.assistencias
                        total_amarelos += j.estatisticas.cartoes_amarelos
                        total_vermelhos += j.estatisticas.cartoes_vermelhos
                stats = self.part_repo.get_estatisticas_time(temp.id)
                total_partidas += stats["jogos"]
                total_vitorias += stats["vitorias"]
                total_jogos_aproveitamento += stats["jogos"]

        aproveitamento = (
            round((total_vitorias * 3 / (total_jogos_aproveitamento * 3)) * 100, 1)
            if total_jogos_aproveitamento else 0
        )

        return {
            "total_times": len(times),
            "total_jogadores": total_jogadores,
            "total_partidas": total_partidas,
            "total_gols": total_gols,
            "total_assistencias": total_assistencias,
            "total_amarelos": total_amarelos,
            "total_vermelhos": total_vermelhos,
            "aproveitamento_geral": aproveitamento,
        }
