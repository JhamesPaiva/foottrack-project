from flask_jwt_extended import get_jwt_identity
from app.services import RankingService
from app.schemas import EstatisticaJogadorSchema
from app.repositories import TemporadaRepository, TimeRepository
from app.utils import success_response, error_response


class RankingController:
    def __init__(self) -> None:
        self.service = RankingService()
        self.schema = EstatisticaJogadorSchema()

    def _uid(self) -> int:
        return int(get_jwt_identity())

    def _get_owned_temporada(self, temporada_id: int):
        temp = TemporadaRepository().get_by_id(temporada_id)
        if not temp:
            return None
        time = TimeRepository().get_by_id(temp.time_id)
        return temp if time and time.usuario_id == self._uid() else None

    def get_ranking(self, temporada_id: int):
        if not self._get_owned_temporada(temporada_id):
            return error_response("Temporada não encontrada.", 404)
        ranking = self.service.get_ranking(temporada_id)
        return success_response(self.schema.dump(ranking, many=True))

    def get_destaques(self, temporada_id: int):
        if not self._get_owned_temporada(temporada_id):
            return error_response("Temporada não encontrada.", 404)
        artilheiro = self.service.get_artilheiro(temporada_id)
        lider_ast = self.service.get_lider_assistencias(temporada_id)
        return success_response({
            "artilheiro": self.schema.dump(artilheiro) if artilheiro else None,
            "lider_assistencias": self.schema.dump(lider_ast) if lider_ast else None,
        })
