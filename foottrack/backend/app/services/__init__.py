from .auth import AuthService
from .time import TimeService
from .temporada import TemporadaService
from .jogador import JogadorService
from .adversario import AdversarioService
from .partida import PartidaService
from .ranking import RankingService
from .dashboard import DashboardService

__all__ = [
    "AuthService", "TimeService", "TemporadaService", "JogadorService",
    "AdversarioService", "PartidaService", "RankingService", "DashboardService",
]
