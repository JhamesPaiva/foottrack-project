from datetime import datetime, timezone
from app.extensions import db


class Historico(db.Model):
    __tablename__ = "historico"

    id: int = db.Column(db.Integer, primary_key=True)
    usuario_id: int = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False, index=True)
    jogador_id: int = db.Column(db.Integer, db.ForeignKey("jogadores.id"), index=True)
    partida_id: int = db.Column(db.Integer, db.ForeignKey("partidas.id"), index=True)
    descricao: str = db.Column(db.Text, nullable=False)
    data_evento: datetime = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), index=True
    )