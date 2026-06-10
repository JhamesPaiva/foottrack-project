from flask import request
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from app.services import JogadorService
from app.schemas import JogadorSchema
from app.repositories import TemporadaRepository, TimeRepository, JogadorRepository, HistoricoRepository
from app.utils import success_response, error_response, salvar_imagem, allowed_file


class JogadorController:
    def __init__(self) -> None:
        self.service = JogadorService()
        self.schema = JogadorSchema()

    def _uid(self) -> int:
        return int(get_jwt_identity())

    def _get_owned_temporada(self, temporada_id: int):
        temp = TemporadaRepository().get_by_id(temporada_id)
        if not temp:
            return None
        time = TimeRepository().get_by_id(temp.time_id)
        return temp if time and time.usuario_id == self._uid() else None

    def _get_owned_jogador(self, jogador_id: int):
        jogador = JogadorRepository().get_by_id(jogador_id)
        if not jogador:
            return None
        return jogador if self._get_owned_temporada(jogador.temporada_id) else None

    def listar(self, temporada_id: int):
        if not self._get_owned_temporada(temporada_id):
            return error_response("Temporada não encontrada.", 404)
        jogadores = self.service.listar(temporada_id)
        return success_response(self.schema.dump(jogadores, many=True))

    def criar(self, temporada_id: int):
        if not self._get_owned_temporada(temporada_id):
            return error_response("Temporada não encontrada.", 404)
        try:
            jogador = self.service.criar(temporada_id, request.get_json() or {})
            return success_response(self.schema.dump(jogador), "Jogador criado.", 201)
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def get(self, jogador_id: int):
        jogador = self._get_owned_jogador(jogador_id)
        if not jogador:
            return error_response("Jogador não encontrado.", 404)
        return success_response(self.schema.dump(jogador))

    def get_historico(self, jogador_id: int):
        jogador = self._get_owned_jogador(jogador_id)
        if not jogador:
            return error_response("Jogador não encontrado.", 404)
        from app.schemas import HistoricoSchema
        historicos = HistoricoRepository().get_by_jogador(jogador_id)
        return success_response(HistoricoSchema().dump(historicos, many=True))

    def atualizar(self, jogador_id: int):
        jogador = self._get_owned_jogador(jogador_id)
        if not jogador:
            return error_response("Jogador não encontrado.", 404)
        try:
            jogador = self.service.atualizar(jogador, request.get_json() or {})
            return success_response(self.schema.dump(jogador), "Jogador atualizado.")
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def atualizar_foto(self, jogador_id: int):
        jogador = self._get_owned_jogador(jogador_id)
        if not jogador:
            return error_response("Jogador não encontrado.", 404)
        file = request.files.get("foto")
        if not file or not allowed_file(file.filename):
            return error_response("Arquivo inválido. Use PNG, JPG ou JPEG.", 400)
        caminho = salvar_imagem(file, "fotos")
        jogador = self.service.atualizar_foto(jogador, caminho)
        return success_response(self.schema.dump(jogador), "Foto atualizada.")

    def deletar(self, jogador_id: int):
        jogador = self._get_owned_jogador(jogador_id)
        if not jogador:
            return error_response("Jogador não encontrado.", 404)
        self.service.deletar(jogador)
        return success_response(None, "Jogador excluído.")
