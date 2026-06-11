from datetime import date
from app.extensions import db


class Temporada(db.Model):
    __tablename__ = "temporadas"

    id: int = db.Column(db.Integer, primary_key=True)
    time_id: int = db.Column(db.Integer, db.ForeignKey("times.id"), nullable=False, index=True)
    nome: str = db.Column(db.String(40), nullable=False)
    data_inicio: date = db.Column(db.Date)
    data_fim: date = db.Column(db.Date)
    status: str = db.Column(db.String(20), default="ativa", index=True)

    jogadores = db.relationship(
        "Jogador", backref="temporada", lazy=True, cascade="all, delete-orphan"
    )
    partidas = db.relationship(
        "Partida", backref="temporada", lazy=True, cascade="all, delete-orphan"
    )