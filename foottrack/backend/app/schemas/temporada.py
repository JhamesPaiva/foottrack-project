from marshmallow import Schema, fields, validate


class TemporadaSchema(Schema):
    id = fields.Int(dump_only=True)
    time_id = fields.Int(dump_only=True)
    nome = fields.Str(required=True, validate=validate.Length(min=1, max=40))
    data_inicio = fields.Date()
    data_fim = fields.Date()
    status = fields.Str(dump_only=True)
