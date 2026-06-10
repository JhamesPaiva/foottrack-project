from marshmallow import Schema, fields


class EstatisticaPartidaSchema(Schema):
    id = fields.Int(dump_only=True)
    partida_id = fields.Int(dump_only=True)
    jogador_id = fields.Int()
    jogador = fields.Nested("JogadorSchema", only=["id", "nome", "posicao", "foto"], dump_only=True)
    participou = fields.Bool()
    gols = fields.Int()
    assistencias = fields.Int()
    cartoes_amarelos = fields.Int()
    cartoes_vermelhos = fields.Int()


class EstatisticaJogadorSchema(Schema):
    id = fields.Int(dump_only=True)
    jogador_id = fields.Int(dump_only=True)
    jogos = fields.Int()
    gols = fields.Int()
    assistencias = fields.Int()
    cartoes_amarelos = fields.Int()
    cartoes_vermelhos = fields.Int()
    pontos_ranking = fields.Int()
