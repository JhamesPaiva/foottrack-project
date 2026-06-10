from app.extensions import db

POSICOES = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meio-Campo", "Atacante"]


class Jogador(db.Model):
    __tablename__ = "jogadores"

    id: int = db.Column(db.Integer, primary_key=True)
    temporada_id: int = db.Column(db.Integer, db.ForeignKey("temporadas.id"), nullable=False)
    nome: str = db.Column(db.String(120), nullable=False)
    posicao: str = db.Column(db.String(30))
    foto: str = db.Column(db.String(255))

    estatisticas = db.relationship(
        "EstatisticaJogador",
        backref="jogador",
        lazy=True,
        uselist=False,
        cascade="all, delete-orphan",
    )
    estatisticas_partida = db.relationship(
        "EstatisticaPartida", backref="jogador", lazy=True, cascade="all, delete-orphan"
    )
    historicos = db.relationship("Historico", backref="jogador", lazy=True)

    def __repr__(self) -> str:
        return f"<Jogador {self.nome}>"
