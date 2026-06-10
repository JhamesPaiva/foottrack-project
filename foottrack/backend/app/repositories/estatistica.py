from typing import Optional
from app.extensions import db
from app.models import EstatisticaPartida, EstatisticaJogador, Jogador
from .base import BaseRepository


class EstatisticaRepository(BaseRepository[EstatisticaJogador]):
    def __init__(self) -> None:
        super().__init__(EstatisticaJogador)

    def get_or_create_jogador(self, jogador_id: int) -> EstatisticaJogador:
        est = db.session.execute(
            db.select(EstatisticaJogador).where(EstatisticaJogador.jogador_id == jogador_id)
        ).scalar_one_or_none()
        if not est:
            est = EstatisticaJogador(jogador_id=jogador_id)
            db.session.add(est)
        return est

    def get_partida_jogador(self, partida_id: int, jogador_id: int) -> Optional[EstatisticaPartida]:
        return db.session.execute(
            db.select(EstatisticaPartida).where(
                EstatisticaPartida.partida_id == partida_id,
                EstatisticaPartida.jogador_id == jogador_id,
            )
        ).scalar_one_or_none()

    def get_ranking(self, temporada_id: int) -> list[EstatisticaJogador]:
        return db.session.execute(
            db.select(EstatisticaJogador)
            .join(Jogador)
            .where(Jogador.temporada_id == temporada_id)
            .order_by(EstatisticaJogador.pontos_ranking.desc())
        ).scalars().all()

    def get_by_partida(self, partida_id: int) -> list[EstatisticaPartida]:
        return db.session.execute(
            db.select(EstatisticaPartida).where(EstatisticaPartida.partida_id == partida_id)
        ).scalars().all()
