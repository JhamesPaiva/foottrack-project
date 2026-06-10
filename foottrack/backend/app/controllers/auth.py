from flask import request
from flask_jwt_extended import create_access_token
from marshmallow import ValidationError
from app.services import AuthService
from app.schemas import UsuarioSchema
from app.utils import success_response, error_response


class AuthController:
    def __init__(self) -> None:
        self.service = AuthService()
        self.schema = UsuarioSchema()

    def register(self):
        try:
            usuario = self.service.register(request.get_json() or {})
            return success_response(self.schema.dump(usuario), "Usuário criado com sucesso.", 201)
        except ValidationError as e:
            return error_response("Dados inválidos.", 422, e.messages)

    def login(self):
        try:
            usuario = self.service.login(request.get_json() or {})
            token = create_access_token(identity=str(usuario.id))
            return success_response(
                {"token": token, "usuario": self.schema.dump(usuario)},
                "Login realizado com sucesso.",
            )
        except ValidationError as e:
            return error_response("Credenciais inválidas.", 401, e.messages)
