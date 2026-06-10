from app.extensions import db


class Time(db.Model):
    __tablename__ = "times"

    id: int = db.Column(db.Integer, primary_key=True)
    usuario_id: int = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    nome: str = db.Column(db.String(120), nullable=False)
    cidade: str = db.Column(db.String(100))
    categoria: str = db.Column(db.String(80))
    ano_fundacao: int = db.Column(db.Integer)
    escudo: str = db.Column(db.String(255))

    temporadas = db.relationship(
        "Temporada", backref="time", lazy=True, cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Time {self.nome}>"
