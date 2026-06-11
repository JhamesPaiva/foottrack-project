from app.extensions import db


class EstatisticaPartida(db.Model):
    __tablename__ = "estatisticas_partida"

    id: int = db.Column(db.Integer, primary_key=True)
    partida_id: int = db.Column(db.Integer, db.ForeignKey("partidas.id"), nullable=False, index=True)
    jogador_id: int = db.Column(db.Integer, db.ForeignKey("jogadores.id"), nullable=False, index=True)
    participou: bool = db.Column(db.Boolean, default=True)
    gols: int = db.Column(db.Integer, default=0)
    assistencias: int = db.Column(db.Integer, default=0)
    cartoes_amarelos: int = db.Column(db.Integer, default=0)
    cartoes_vermelhos: int = db.Column(db.Integer, default=0)