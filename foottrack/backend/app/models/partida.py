from datetime import date, time
from app.extensions import db


class Partida(db.Model):
    __tablename__ = "partidas"

    id: int = db.Column(db.Integer, primary_key=True)
    temporada_id: int = db.Column(db.Integer, db.ForeignKey("temporadas.id"), nullable=False, index=True)
    adversario_id: int = db.Column(db.Integer, db.ForeignKey("adversarios.id"), nullable=False, index=True)
    data_partida: date = db.Column(db.Date, nullable=False, index=True)
    horario: time = db.Column(db.Time)
    local: str = db.Column(db.String(150))
    competicao: str = db.Column(db.String(100))
    rodada: str = db.Column(db.String(40))
    observacoes: str = db.Column(db.Text)
    mandante: bool = db.Column(db.Boolean, default=True)
    gols_pro: int = db.Column(db.Integer, default=0)
    gols_contra: int = db.Column(db.Integer, default=0)
    resultado: str = db.Column(db.String(10), index=True)

    estatisticas = db.relationship(
        "EstatisticaPartida", backref="partida", lazy=True, cascade="all, delete-orphan"
    )
    historicos = db.relationship("Historico", backref="partida", lazy=True)

    def calcular_resultado(self) -> str:
        if self.gols_pro > self.gols_contra:
            return "vitoria"
        if self.gols_pro == self.gols_contra:
            return "empate"
        return "derrota"