from flask import request
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from app.services import TemporadaService
from app.schemas import TemporadaSchema
from app.repositories import TimeRepository, TemporadaRepository
from app.utils import success_response, error_response


class TemporadaController:
    def __init__(self) -> None:
        self.service = TemporadaService()
        self.schema = TemporadaSchema()

    def _uid(self) -> int:
        return int(get_jwt_identity())

    def _get_owned_time(self, time_id: int):
        time = TimeRepository().get_by_id(time_id)
        return time if time and time.usuario_id == self._uid() else None

    def _get_owned_temporada(self, temporada_id: int):
        temp = TemporadaRepository().get_by_id(temporada_id)
        if not temp:
            return None
        time = TimeRepository().get_by_id(temp.time_id)
        return temp if time and time.usuario_id == self._uid() else None

    def listar(self, time_id: int):
        if not self._get_owned_time(time_id):
            return error_response("Time não encontrado.", 404)
        temporadas = self.service.listar(time_id)
        return success_response(self.schema.dump(temporadas, many=True))

    def criar(self, time_id: int):
        if not self._get_owned_time(time_id):
            return error_response("Time não encontrado.", 404)
        try:
            temp = self.service.criar(time_id, request.get_json() or {})
            return success_response(self.schema.dump(temp), "Temporada criada.", 201)
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def encerrar(self, temporada_id: int):
        temp = self._get_owned_temporada(temporada_id)
        if not temp:
            return error_response("Temporada não encontrada.", 404)
        temp = self.service.encerrar(temp)
        return success_response(self.schema.dump(temp), "Temporada encerrada.")

    def reabrir(self, temporada_id: int):
        temp = self._get_owned_temporada(temporada_id)
        if not temp:
            return error_response("Temporada não encontrada.", 404)
        temp = self.service.reabrir(temp)
        return success_response(self.schema.dump(temp), "Temporada reaberta.")
