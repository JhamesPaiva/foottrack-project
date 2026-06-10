from marshmallow import Schema, fields, validate, validates_schema, ValidationError


class EstatisticaItemSchema(Schema):
    jogador_id = fields.Int(required=True)
    participou = fields.Bool(load_default=True)
    gols = fields.Int(load_default=0, validate=validate.Range(min=0))
    assistencias = fields.Int(load_default=0, validate=validate.Range(min=0))
    cartoes_amarelos = fields.Int(load_default=0, validate=validate.Range(min=0))
    cartoes_vermelhos = fields.Int(load_default=0, validate=validate.Range(min=0))


class PartidaCreateSchema(Schema):
    adversario_id = fields.Int(required=True)
    data_partida = fields.Date(required=True)
    horario = fields.Time()
    local = fields.Str(validate=validate.Length(max=150))
    competicao = fields.Str(validate=validate.Length(max=100))
    rodada = fields.Str(validate=validate.Length(max=40))
    observacoes = fields.Str()
    mandante = fields.Bool(load_default=True)
    gols_pro = fields.Int(required=True, validate=validate.Range(min=0))
    gols_contra = fields.Int(required=True, validate=validate.Range(min=0))
    estatisticas = fields.List(fields.Nested(EstatisticaItemSchema), load_default=[])


class PartidaSchema(Schema):
    id = fields.Int(dump_only=True)
    temporada_id = fields.Int(dump_only=True)
    adversario_id = fields.Int()
    adversario = fields.Nested("AdversarioSchema", dump_only=True)
    data_partida = fields.Date()
    horario = fields.Time()
    local = fields.Str()
    competicao = fields.Str()
    rodada = fields.Str()
    observacoes = fields.Str()
    mandante = fields.Bool()
    gols_pro = fields.Int()
    gols_contra = fields.Int()
    resultado = fields.Str(dump_only=True)
    estatisticas = fields.List(fields.Nested("EstatisticaPartidaSchema"), dump_only=True)
