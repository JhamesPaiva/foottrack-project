from marshmallow import Schema, fields, validate, validates, ValidationError


class RegisterSchema(Schema):
    usuario = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    senha = fields.Str(required=True, validate=validate.Length(min=8), load_only=True)
    confirmar_senha = fields.Str(required=True, load_only=True)

    @validates("usuario")
    def validate_usuario(self, value):
        import re
        if not re.match(r"^[a-zA-Z0-9_]+$", value):
            raise ValidationError("Usuário pode conter apenas letras, números e _")


class LoginSchema(Schema):
    usuario = fields.Str(required=True)
    senha = fields.Str(required=True, load_only=True)


class UsuarioSchema(Schema):
    id = fields.Int(dump_only=True)
    usuario = fields.Str(dump_only=True)
    data_criacao = fields.DateTime(dump_only=True)
