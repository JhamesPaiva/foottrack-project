from flask import request
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from app.services import AdversarioService
from app.schemas import AdversarioSchema
from app.repositories import AdversarioRepository
from app.utils import success_response, error_response, salvar_imagem, allowed_file


class AdversarioController:
    def __init__(self) -> None:
        self.service = AdversarioService()
        self.schema = AdversarioSchema()

    def _uid(self) -> int:
        return int(get_jwt_identity())

    def _get_owned(self, adv_id: int):
        adv = AdversarioRepository().get_by_id(adv_id)
        return adv if adv and adv.usuario_id == self._uid() else None

    def listar(self):
        advs = self.service.listar(self._uid())
        return success_response(self.schema.dump(advs, many=True))

    def criar(self):
        try:
            adv = self.service.criar(self._uid(), request.get_json() or {})
            return success_response(self.schema.dump(adv), "Adversário criado.", 201)
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def atualizar(self, adv_id: int):
        adv = self._get_owned(adv_id)
        if not adv:
            return error_response("Adversário não encontrado.", 404)
        try:
            adv = self.service.atualizar(adv, request.get_json() or {})
            return success_response(self.schema.dump(adv), "Adversário atualizado.")
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def atualizar_escudo(self, adv_id: int):
        adv = self._get_owned(adv_id)
        if not adv:
            return error_response("Adversário não encontrado.", 404)
        file = request.files.get("escudo")
        if not file or not allowed_file(file.filename):
            return error_response("Arquivo inválido.", 400)
        caminho = salvar_imagem(file, "escudos")
        adv = self.service.atualizar_escudo(adv, caminho)
        return success_response(self.schema.dump(adv), "Escudo atualizado.")

    def deletar(self, adv_id: int):
        adv = self._get_owned(adv_id)
        if not adv:
            return error_response("Adversário não encontrado.", 404)
        self.service.deletar(adv)
        return success_response(None, "Adversário excluído.")
