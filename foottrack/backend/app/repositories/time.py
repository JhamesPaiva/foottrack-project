from app.extensions import db
from app.models import Time
from .base import BaseRepository


class TimeRepository(BaseRepository[Time]):
    def __init__(self) -> None:
        super().__init__(Time)

    def get_by_usuario(self, usuario_id: int) -> list[Time]:
        return db.session.execute(
            db.select(Time).where(Time.usuario_id == usuario_id)
        ).scalars().all()
