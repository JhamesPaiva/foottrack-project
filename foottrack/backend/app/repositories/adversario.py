from app.extensions import db
from app.models import Adversario
from .base import BaseRepository


class AdversarioRepository(BaseRepository[Adversario]):
    def __init__(self) -> None:
        super().__init__(Adversario)

    def get_by_usuario(self, usuario_id: int) -> list[Adversario]:
        return db.session.execute(
            db.select(Adversario).where(Adversario.usuario_id == usuario_id).order_by(Adversario.nome)
        ).scalars().all()
