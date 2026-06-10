from typing import Optional
from app.extensions import db
from app.models import Temporada
from .base import BaseRepository


class TemporadaRepository(BaseRepository[Temporada]):
    def __init__(self) -> None:
        super().__init__(Temporada)

    def get_by_time(self, time_id: int) -> list[Temporada]:
        return db.session.execute(
            db.select(Temporada).where(Temporada.time_id == time_id).order_by(Temporada.nome.desc())
        ).scalars().all()

    def get_ativa(self, time_id: int) -> Optional[Temporada]:
        return db.session.execute(
            db.select(Temporada).where(
                Temporada.time_id == time_id, Temporada.status == "ativa"
            )
        ).scalar_one_or_none()
