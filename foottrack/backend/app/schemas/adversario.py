from marshmallow import Schema, fields, validate


class AdversarioSchema(Schema):
    id = fields.Int(dump_only=True)
    usuario_id = fields.Int(dump_only=True)
    nome = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    cidade = fields.Str(validate=validate.Length(max=100))
    categoria = fields.Str(validate=validate.Length(max=80))
    escudo = fields.Str(dump_only=True)
