from flask import request
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from app.services import TimeService
from app.schemas import TimeSchema
from app.utils import success_response, error_response, salvar_imagem, allowed_file


class TimeController:
    def __init__(self) -> None:
        self.service = TimeService()
        self.schema = TimeSchema()

    def _get_usuario_id(self) -> int:
        return int(get_jwt_identity())

    def listar(self):
        times = self.service.listar(self._get_usuario_id())
        return success_response(self.schema.dump(times, many=True))

    def criar(self):
        try:
            time = self.service.criar(self._get_usuario_id(), request.get_json() or {})
            return success_response(self.schema.dump(time), "Time criado.", 201)
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def get(self, time_id: int):
        time = self._get_owned(time_id)
        if not time:
            return error_response("Time não encontrado.", 404)
        return success_response(self.schema.dump(time))

    def atualizar(self, time_id: int):
        time = self._get_owned(time_id)
        if not time:
            return error_response("Time não encontrado.", 404)
        try:
            time = self.service.atualizar(time, request.get_json() or {})
            return success_response(self.schema.dump(time), "Time atualizado.")
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def atualizar_escudo(self, time_id: int):
        time = self._get_owned(time_id)
        if not time:
            return error_response("Time não encontrado.", 404)
        file = request.files.get("escudo")
        if not file or not allowed_file(file.filename):
            return error_response("Arquivo inválido. Use PNG, JPG ou JPEG.", 400)
        caminho = salvar_imagem(file, "escudos")
        time = self.service.atualizar_escudo(time, caminho)
        return success_response(self.schema.dump(time), "Escudo atualizado.")

    def deletar(self, time_id: int):
        time = self._get_owned(time_id)
        if not time:
            return error_response("Time não encontrado.", 404)
        self.service.deletar(time)
        return success_response(None, "Time excluído.")

    def _get_owned(self, time_id: int):
        from app.repositories import TimeRepository
        time = TimeRepository().get_by_id(time_id)
        if time and time.usuario_id == self._get_usuario_id():
            return time
        return None
