from datetime import date
from app.extensions import db


class Temporada(db.Model):
    __tablename__ = "temporadas"

    id: int = db.Column(db.Integer, primary_key=True)
    time_id: int = db.Column(db.Integer, db.ForeignKey("times.id"), nullable=False)
    nome: str = db.Column(db.String(40), nullable=False)
    data_inicio: date = db.Column(db.Date)
    data_fim: date = db.Column(db.Date)
    status: str = db.Column(db.String(20), default="ativa")  # ativa | encerrada

    jogadores = db.relationship(
        "Jogador", backref="temporada", lazy=True, cascade="all, delete-orphan"
    )
    partidas = db.relationship(
        "Partida", backref="temporada", lazy=True, cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Temporada {self.nome}>"
