from flask_jwt_extended import get_jwt_identity
from app.repositories import HistoricoRepository
from app.schemas import HistoricoSchema
from app.utils import success_response


class HistoricoController:
    def __init__(self) -> None:
        self.repo = HistoricoRepository()
        self.schema = HistoricoSchema()

    def listar(self):
        uid = int(get_jwt_identity())
        historicos = self.repo.get_by_usuario(uid, limit=100)
        return success_response(self.schema.dump(historicos, many=True))
