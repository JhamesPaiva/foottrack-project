from marshmallow import Schema, fields, validate


class TimeSchema(Schema):
    id = fields.Int(dump_only=True)
    usuario_id = fields.Int(dump_only=True)
    nome = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    cidade = fields.Str(validate=validate.Length(max=100))
    categoria = fields.Str(validate=validate.Length(max=80))
    ano_fundacao = fields.Int(validate=validate.Range(min=1800, max=2100))
    escudo = fields.Str(dump_only=True)
