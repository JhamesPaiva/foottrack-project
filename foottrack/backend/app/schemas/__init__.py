from .usuario import UsuarioSchema, LoginSchema, RegisterSchema
from .time import TimeSchema
from .temporada import TemporadaSchema
from .jogador import JogadorSchema
from .adversario import AdversarioSchema
from .partida import PartidaSchema, PartidaCreateSchema
from .estatistica import EstatisticaPartidaSchema, EstatisticaJogadorSchema
from .historico import HistoricoSchema

__all__ = [
    "UsuarioSchema", "LoginSchema", "RegisterSchema",
    "TimeSchema", "TemporadaSchema", "JogadorSchema",
    "AdversarioSchema", "PartidaSchema", "PartidaCreateSchema",
    "EstatisticaPartidaSchema", "EstatisticaJogadorSchema",
    "HistoricoSchema",
]
