from app.extensions import db


class EstatisticaJogador(db.Model):
    __tablename__ = "estatisticas_jogador"

    id: int = db.Column(db.Integer, primary_key=True)
    jogador_id: int = db.Column(db.Integer, db.ForeignKey("jogadores.id"), nullable=False)
    jogos: int = db.Column(db.Integer, default=0)
    gols: int = db.Column(db.Integer, default=0)
    assistencias: int = db.Column(db.Integer, default=0)
    cartoes_amarelos: int = db.Column(db.Integer, default=0)
    cartoes_vermelhos: int = db.Column(db.Integer, default=0)
    pontos_ranking: int = db.Column(db.Integer, default=0)

    def recalcular_pontos(self) -> None:
        self.pontos_ranking = (
            self.gols * 5
            + self.assistencias * 3
            + self.jogos * 1
            - self.cartoes_amarelos * 1
            - self.cartoes_vermelhos * 3
        )

    def __repr__(self) -> str:
        return f"<EstatisticaJogador jogador={self.jogador_id}>"
