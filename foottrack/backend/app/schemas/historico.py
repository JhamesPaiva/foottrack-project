from marshmallow import Schema, fields


class HistoricoSchema(Schema):
    id = fields.Int(dump_only=True)
    usuario_id = fields.Int(dump_only=True)
    jogador_id = fields.Int()
    partida_id = fields.Int()
    jogador = fields.Nested("JogadorSchema", only=["id", "nome"], dump_only=True)
    descricao = fields.Str()
    data_evento = fields.DateTime(dump_only=True)
