from typing import Optional
from app.extensions import db
from app.models import Usuario
from .base import BaseRepository


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self) -> None:
        super().__init__(Usuario)

    def get_by_usuario(self, usuario: str) -> Optional[Usuario]:
        return db.session.execute(
            db.select(Usuario).where(Usuario.usuario == usuario)
        ).scalar_one_or_none()

    def exists(self, usuario: str) -> bool:
        return self.get_by_usuario(usuario) is not None
