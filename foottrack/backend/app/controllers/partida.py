from flask import request
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from app.services import PartidaService
from app.schemas import PartidaSchema
from app.repositories import TemporadaRepository, TimeRepository, PartidaRepository
from app.utils import success_response, error_response


class PartidaController:
    def __init__(self) -> None:
        self.service = PartidaService()
        self.schema = PartidaSchema()

    def _uid(self) -> int:
        return int(get_jwt_identity())

    def _get_owned_temporada(self, temporada_id: int):
        temp = TemporadaRepository().get_by_id(temporada_id)
        if not temp:
            return None
        time = TimeRepository().get_by_id(temp.time_id)
        return temp if time and time.usuario_id == self._uid() else None

    def _get_owned_partida(self, partida_id: int):
        partida = PartidaRepository().get_by_id(partida_id)
        if not partida:
            return None
        return partida if self._get_owned_temporada(partida.temporada_id) else None

    def listar(self, temporada_id: int):
        if not self._get_owned_temporada(temporada_id):
            return error_response("Temporada não encontrada.", 404)
        partidas = self.service.listar(temporada_id)
        return success_response(self.schema.dump(partidas, many=True))

    def estatisticas_time(self, temporada_id: int):
        if not self._get_owned_temporada(temporada_id):
            return error_response("Temporada não encontrada.", 404)
        stats = self.service.estatisticas_time(temporada_id)
        return success_response(stats)

    def criar(self, temporada_id: int):
        if not self._get_owned_temporada(temporada_id):
            return error_response("Temporada não encontrada.", 404)
        try:
            partida = self.service.criar(temporada_id, self._uid(), request.get_json() or {})
            return success_response(self.schema.dump(partida), "Partida registrada.", 201)
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def get(self, partida_id: int):
        partida = self._get_owned_partida(partida_id)
        if not partida:
            return error_response("Partida não encontrada.", 404)
        return success_response(self.schema.dump(partida))

    def atualizar(self, partida_id: int):
        partida = self._get_owned_partida(partida_id)
        if not partida:
            return error_response("Partida não encontrada.", 404)
        try:
            partida = self.service.atualizar(partida, self._uid(), request.get_json() or {})
            return success_response(self.schema.dump(partida), "Partida atualizada.")
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def deletar(self, partida_id: int):
        partida = self._get_owned_partida(partida_id)
        if not partida:
            return error_response("Partida não encontrada.", 404)
        self.service.deletar(partida)
        return success_response(None, "Partida excluída.")
