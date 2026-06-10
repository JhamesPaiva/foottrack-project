from app.extensions import db
from app.models import Historico
from .base import BaseRepository


class HistoricoRepository(BaseRepository[Historico]):
    def __init__(self) -> None:
        super().__init__(Historico)

    def get_by_usuario(self, usuario_id: int, limit: int = 50) -> list[Historico]:
        return db.session.execute(
            db.select(Historico)
            .where(Historico.usuario_id == usuario_id)
            .order_by(Historico.data_evento.desc())
            .limit(limit)
        ).scalars().all()

    def get_by_jogador(self, jogador_id: int) -> list[Historico]:
        return db.session.execute(
            db.select(Historico)
            .where(Historico.jogador_id == jogador_id)
            .order_by(Historico.data_evento.desc())
        ).scalars().all()
