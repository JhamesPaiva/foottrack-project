from flask import Flask
from .extensions import db, migrate, jwt, cors
from .config import config_by_name


def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Import models so Migrate finds them
    with app.app_context():
        from . import models  # noqa: F401

    # Register blueprints
    from .routes import register_routes
    register_routes(app)

    return app
