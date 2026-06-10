from app.extensions import db
from app.models import Partida
from .base import BaseRepository


class PartidaRepository(BaseRepository[Partida]):
    def __init__(self) -> None:
        super().__init__(Partida)

    def get_by_temporada(self, temporada_id: int) -> list[Partida]:
        return db.session.execute(
            db.select(Partida)
            .where(Partida.temporada_id == temporada_id)
            .order_by(Partida.data_partida.desc())
        ).scalars().all()

    def get_estatisticas_time(self, temporada_id: int) -> dict:
        partidas = self.get_by_temporada(temporada_id)
        jogos = len(partidas)
        vitorias = sum(1 for p in partidas if p.resultado == "vitoria")
        empates = sum(1 for p in partidas if p.resultado == "empate")
        derrotas = sum(1 for p in partidas if p.resultado == "derrota")
        gols_pro = sum(p.gols_pro for p in partidas)
        gols_contra = sum(p.gols_contra for p in partidas)
        aproveitamento = round((vitorias * 3 / (jogos * 3)) * 100, 1) if jogos else 0
        return {
            "jogos": jogos, "vitorias": vitorias, "empates": empates,
            "derrotas": derrotas, "gols_pro": gols_pro, "gols_contra": gols_contra,
            "saldo_gols": gols_pro - gols_contra, "aproveitamento": aproveitamento,
        }
