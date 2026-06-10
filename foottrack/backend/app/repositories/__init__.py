from .base import BaseRepository
from .usuario import UsuarioRepository
from .time import TimeRepository
from .temporada import TemporadaRepository
from .jogador import JogadorRepository
from .adversario import AdversarioRepository
from .partida import PartidaRepository
from .estatistica import EstatisticaRepository
from .historico import HistoricoRepository

__all__ = [
    "BaseRepository", "UsuarioRepository", "TimeRepository",
    "TemporadaRepository", "JogadorRepository", "AdversarioRepository",
    "PartidaRepository", "EstatisticaRepository", "HistoricoRepository",
]
