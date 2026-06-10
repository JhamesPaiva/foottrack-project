from .auth import AuthController
from .time import TimeController
from .temporada import TemporadaController
from .jogador import JogadorController
from .adversario import AdversarioController
from .partida import PartidaController
from .ranking import RankingController
from .dashboard import DashboardController
from .historico import HistoricoController

__all__ = [
    "AuthController", "TimeController", "TemporadaController", "JogadorController",
    "AdversarioController", "PartidaController", "RankingController",
    "DashboardController", "HistoricoController",
]
