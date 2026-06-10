from app.extensions import db
from app.models import Jogador
from .base import BaseRepository


class JogadorRepository(BaseRepository[Jogador]):
    def __init__(self) -> None:
        super().__init__(Jogador)

    def get_by_temporada(self, temporada_id: int) -> list[Jogador]:
        return db.session.execute(
            db.select(Jogador).where(Jogador.temporada_id == temporada_id).order_by(Jogador.nome)
        ).scalars().all()

    def count_by_temporada(self, temporada_id: int) -> int:
        return db.session.execute(
            db.select(db.func.count()).where(Jogador.temporada_id == temporada_id)
        ).scalar_one()
