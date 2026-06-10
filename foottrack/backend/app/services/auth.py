import bcrypt
from marshmallow import ValidationError
from app.models import Usuario
from app.repositories import UsuarioRepository
from app.schemas import RegisterSchema, LoginSchema


class AuthService:
    def __init__(self) -> None:
        self.repo = UsuarioRepository()
        self.register_schema = RegisterSchema()
        self.login_schema = LoginSchema()

    def register(self, data: dict) -> Usuario:
        errors = self.register_schema.validate(data)
        if errors:
            raise ValidationError(errors)

        if data["senha"] != data["confirmar_senha"]:
            raise ValidationError({"confirmar_senha": ["As senhas não conferem."]})

        if self.repo.exists(data["usuario"]):
            raise ValidationError({"usuario": ["Nome de usuário já está em uso."]})

        senha_hash = bcrypt.hashpw(data["senha"].encode(), bcrypt.gensalt()).decode()
        usuario = Usuario(usuario=data["usuario"], senha_hash=senha_hash)
        return self.repo.save(usuario)

    def login(self, data: dict) -> Usuario:
        errors = self.login_schema.validate(data)
        if errors:
            raise ValidationError(errors)

        usuario = self.repo.get_by_usuario(data["usuario"])
        if not usuario:
            raise ValidationError({"usuario": ["Usuário ou senha inválidos."]})

        if not bcrypt.checkpw(data["senha"].encode(), usuario.senha_hash.encode()):
            raise ValidationError({"senha": ["Usuário ou senha inválidos."]})

        return usuario
