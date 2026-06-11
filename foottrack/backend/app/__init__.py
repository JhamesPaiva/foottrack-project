from flask import Flask, jsonify
from .extensions import db, migrate, jwt, cors, limiter
from .config import config_by_name


def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"success": False, "message": "Token expirado. Faça login novamente."}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"success": False, "message": "Token inválido."}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"success": False, "message": "Token não fornecido."}), 401

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "Recurso não encontrado."}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"success": False, "message": "Método não permitido."}), 405

    @app.errorhandler(413)
    def request_too_large(e):
        return jsonify({"success": False, "message": "Arquivo muito grande. Máximo 5MB."}), 413

    @app.errorhandler(429)
    def rate_limit_exceeded(e):
        return jsonify({"success": False, "message": "Muitas tentativas. Aguarde e tente novamente."}), 429

    @app.errorhandler(500)
    def internal_error(e):
        db.session.rollback()
        return jsonify({"success": False, "message": "Erro interno do servidor."}), 500

    with app.app_context():
        from . import models  # noqa: F401

    from .routes import register_routes
    register_routes(app)

    return app