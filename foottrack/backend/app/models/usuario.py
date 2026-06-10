from datetime import datetime, timezone
from app.extensions import db


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id: int = db.Column(db.Integer, primary_key=True)
    usuario: str = db.Column(db.String(80), unique=True, nullable=False)
    senha_hash: str = db.Column(db.String(255), nullable=False)
    data_criacao: datetime = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    times = db.relationship("Time", backref="usuario", lazy=True, cascade="all, delete-orphan")
    historicos = db.relationship("Historico", backref="usuario", lazy=True)

    def __repr__(self) -> str:
        return f"<Usuario {self.usuario}>"
