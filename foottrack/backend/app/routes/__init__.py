from flask import Flask
from .auth import auth_bp
from .times import times_bp
from .temporadas import temporadas_bp
from .jogadores import jogadores_bp
from .adversarios import adversarios_bp
from .partidas import partidas_bp
from .ranking import ranking_bp
from .dashboard import dashboard_bp
from .historico import historico_bp


def register_routes(app: Flask) -> None:
    prefix = "/api/v1"
    app.register_blueprint(auth_bp, url_prefix=f"{prefix}/auth")
    app.register_blueprint(times_bp, url_prefix=f"{prefix}/times")
    app.register_blueprint(temporadas_bp, url_prefix=f"{prefix}")
    app.register_blueprint(jogadores_bp, url_prefix=f"{prefix}")
    app.register_blueprint(adversarios_bp, url_prefix=f"{prefix}/adversarios")
    app.register_blueprint(partidas_bp, url_prefix=f"{prefix}")
    app.register_blueprint(ranking_bp, url_prefix=f"{prefix}")
    app.register_blueprint(dashboard_bp, url_prefix=f"{prefix}/dashboard")
    app.register_blueprint(historico_bp, url_prefix=f"{prefix}/historico")
