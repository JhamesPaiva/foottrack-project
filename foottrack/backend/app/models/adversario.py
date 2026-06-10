from app.extensions import db


class Adversario(db.Model):
    __tablename__ = "adversarios"

    id: int = db.Column(db.Integer, primary_key=True)
    usuario_id: int = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    nome: str = db.Column(db.String(120), nullable=False)
    cidade: str = db.Column(db.String(100))
    categoria: str = db.Column(db.String(80))
    escudo: str = db.Column(db.String(255))

    partidas = db.relationship("Partida", backref="adversario", lazy=True)

    def __repr__(self) -> str:
        return f"<Adversario {self.nome}>"
