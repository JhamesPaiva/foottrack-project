from marshmallow import Schema, fields, validate

POSICOES = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meio-Campo", "Atacante"]


class JogadorSchema(Schema):
    id = fields.Int(dump_only=True)
    temporada_id = fields.Int(dump_only=True)
    nome = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    posicao = fields.Str(validate=validate.OneOf(POSICOES))
    foto = fields.Str(dump_only=True)
    estatisticas = fields.Nested("EstatisticaJogadorSchema", dump_only=True)
